import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Channel = 'EMAIL' | 'WHATSAPP' | 'SMS';

/**
 * Persists every outbound message as a Notification row, then (in later phases)
 * hands it to the matching provider. Email delivery is wired to Resend; WhatsApp
 * stays click-to-chat in the MVP, so those rows are recorded for staff reference.
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async queue(params: {
    channel: Channel;
    template: string;
    recipient: string;
    payload?: Record<string, unknown>;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        channel: params.channel,
        template: params.template,
        recipient: params.recipient,
        payload: (params.payload ?? {}) as never,
      },
    });

    this.logger.log(
      `Queued ${params.channel} "${params.template}" -> ${params.recipient}`,
    );

    return notification;
  }

  async sendLeadConfirmation(lead: {
    name: string;
    phone: string;
    email: string | null;
  }): Promise<void> {
    if (lead.email) {
      await this.queue({
        channel: 'EMAIL',
        template: 'lead-confirmation',
        recipient: lead.email,
        payload: { name: lead.name },
      });
    }
  }

  async alertStaff(lead: {
    id: string;
    name: string;
    phone: string;
    area: string;
  }): Promise<void> {
    const recipient = process.env.STAFF_ALERT_EMAIL ?? 'sales@example.com';
    await this.queue({
      channel: 'EMAIL',
      template: 'staff-new-lead',
      recipient,
      payload: { leadId: lead.id, name: lead.name, phone: lead.phone, area: lead.area },
    });
  }
}
