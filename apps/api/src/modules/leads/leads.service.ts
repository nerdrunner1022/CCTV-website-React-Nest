import { Injectable } from '@nestjs/common';
import type {
  CreateLeadInput,
  LeadListQuery,
  UpdateLeadStatusInput,
} from '@cctv/shared';
import type { LeadSource, LeadStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SchedulerService } from '../scheduler/scheduler.service';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly scheduler: SchedulerService,
  ) {}

  /** Survey booking form submission: create the lead, its survey, and notify. */
  async create(input: CreateLeadInput) {
    const lead = await this.prisma.lead.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        area: input.area,
        propertyType: input.propertyType,
        source: input.source ?? 'DIRECT',
        note: input.note,
        activities: {
          create: { type: 'CREATED', note: 'Lead captured from website' },
        },
        survey: {
          create: {
            preferredDate: parseDate(input.preferredDate),
            preferredSlot: input.preferredSlot,
            address: input.area,
          },
        },
      },
    });

    await this.notifications.sendLeadConfirmation({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
    });
    await this.notifications.alertStaff({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      area: lead.area,
    });
    await this.scheduler.scheduleLostLeadFollowUps(lead.id);

    return { id: lead.id, status: lead.status };
  }

  async list(query: LeadListQuery) {
    const where: Prisma.LeadWhereInput = {};

    if (query.status) where.status = query.status as LeadStatus;
    if (query.source) where.source = query.source as LeadSource;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { phone: { contains: query.q } },
        { area: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { survey: true },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async updateStatus(id: string, input: UpdateLeadStatusInput) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        status: input.status,
        contactedAt: input.status === 'CONTACTED' ? new Date() : undefined,
        convertedAt: input.status === 'WON' ? new Date() : undefined,
        activities: {
          create: {
            type: 'STATUS_CHANGED',
            note: input.note ?? `Status set to ${input.status}`,
          },
        },
      },
    });
  }
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
