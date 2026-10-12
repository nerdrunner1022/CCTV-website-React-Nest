import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@upstash/qstash';

/**
 * Schedules delayed work (lost-lead follow-ups, AMC renewal reminders).
 *
 * Vercel functions cannot host a long-lived queue, so jobs are published to
 * Upstash QStash, which calls back into the API at the scheduled time.
 * Without a QSTASH_TOKEN configured, calls become no-ops so local dev works.
 */
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly client: Client | null;

  constructor() {
    const token = process.env.QSTASH_TOKEN;
    this.client = token ? new Client({ token }) : null;
  }

  /** Lost leads get an automated follow-up 3 and 14 days later. */
  async scheduleLostLeadFollowUps(leadId: string): Promise<void> {
    await Promise.all(
      [3, 14].map((day) =>
        this.publish('/jobs/qstash/follow-up', { leadId, day }, day * 24 * 60 * 60),
      ),
    );
  }

  /** AMC/warranty reminder 30 days before expiry. */
  async scheduleAmcReminder(contractId: string, delaySeconds: number): Promise<void> {
    await this.publish('/jobs/qstash/amc-reminder', { contractId }, delaySeconds);
  }

  private async publish(
    path: string,
    body: Record<string, unknown>,
    delaySeconds: number,
  ): Promise<void> {
    const baseUrl = process.env.PUBLIC_API_URL;
    if (!this.client || !baseUrl) {
      this.logger.log(`[noop] ${path} (delay ${delaySeconds}s) ${JSON.stringify(body)}`);
      return;
    }

    await this.client.publishJSON({ url: `${baseUrl}${path}`, body, delay: delaySeconds });
  }
}
