import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  AssignLeadInput,
  CreateLeadInput,
  LeadListQuery,
  UpdateLeadStatusInput,
} from '@cctv/shared';
import type { LeadSource, LeadStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SchedulerService } from '../scheduler/scheduler.service';

const ASSIGNEE_SELECT = {
  select: { id: true, name: true, email: true, role: true },
};

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
        facilityName: input.facilityName,
        cameraCountSpec: input.cameraCountSpec,
        propertyType: input.propertyType,
        source: input.source ?? 'DIRECT',
        sourceDetail: input.sourceDetail,
        note: input.note,
        status: 'SURVEY_BOOKED',
        activities: {
          create: { type: 'CREATED', note: 'Lead captured from website' },
        },
        survey: {
          create: {
            preferredDate: parseDate(input.preferredDate),
            preferredSlot: input.preferredSlot,
            address: input.area,
            notes: input.note,
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

  /** Staff-entered lead: store the record without creating a survey booking. */
  async createAdmin(input: CreateLeadInput) {
    return this.prisma.lead.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        area: input.area,
        facilityName: input.facilityName,
        cameraCountSpec: input.cameraCountSpec,
        propertyType: input.propertyType,
        source: input.source ?? 'OTHER',
        sourceDetail: input.sourceDetail,
        note: input.note,
        activities: {
          create: { type: 'CREATED', note: 'Lead entered by staff' },
        },
      },
      include: { survey: true, assignedTo: ASSIGNEE_SELECT },
    });
  }

  async list(query: LeadListQuery) {
    const where: Prisma.LeadWhereInput = {};

    if (query.status) where.status = query.status as LeadStatus;
    if (query.source) where.source = query.source as LeadSource;
    if (query.assignedToId) where.assignedToId = query.assignedToId;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { phone: { contains: query.q } },
        { area: { contains: query.q, mode: 'insensitive' } },
        { facilityName: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { survey: true, assignedTo: ASSIGNEE_SELECT },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  /** Full lead record for the admin detail view: survey, assignee, activity trail. */
  async get(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        survey: true,
        assignedTo: ASSIGNEE_SELECT,
        activities: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  /** Assign (or unassign) a lead to a staff member. */
  async assign(id: string, input: AssignLeadInput) {
    const assignedTo = input.assignedToId
      ? await this.prisma.user.findUnique({
          where: { id: input.assignedToId },
          select: { id: true, name: true },
        })
      : null;

    if (input.assignedToId && !assignedTo) {
      throw new NotFoundException('Staff member not found');
    }

    return this.prisma.lead.update({
      where: { id },
      data: {
        assignedToId: input.assignedToId,
        activities: {
          create: {
            type: 'ASSIGNED',
            note:
              input.note ??
              (assignedTo
                ? `Assigned to ${assignedTo.name}`
                : 'Unassigned'),
          },
        },
      },
      include: { assignedTo: ASSIGNEE_SELECT },
    });
  }

  /** Headline numbers for the admin dashboard. */
  async metrics() {
    const allStatuses = ['NEW', 'CONTACTED', 'SURVEY_BOOKED', 'QUOTED', 'WON', 'LOST', 'INSTALLED'];
    const counts = await Promise.all(
      allStatuses.map((s) =>
        this.prisma.lead.count({ where: { status: s as any } }),
      ),
    );
    const total = counts.reduce((sum, c) => sum + c, 0);
    const byStatus = {} as Record<string, number>;
    allStatuses.forEach((s, i) => { byStatus[s] = counts[i]; });
    const won = (byStatus.WON || 0) + (byStatus.INSTALLED || 0);
    const conversionRate = total === 0 ? 0 : Math.round((won / total) * 100);

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newLast7Days = await this.prisma.lead.count({
      where: { createdAt: { gte: since } },
    });

    const recent = await this.prisma.lead.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: ASSIGNEE_SELECT },
    });

    const surveysBooked = await this.prisma.surveyBooking.count();

    return {
      total,
      newLast7Days,
      surveysBooked,
      won,
      conversionRate,
      byStatus,
      recent,
    };
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
