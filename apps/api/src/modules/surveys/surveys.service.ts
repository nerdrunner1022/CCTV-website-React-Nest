import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createSurveySchema, type CreateSurveyInput } from '@cctv/shared';

@Injectable()
export class SurveysService {
  constructor(private readonly prisma: PrismaService) {}

  /** List all surveys (admin view). */
  async list() {
    return this.prisma.surveyBooking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { lead: { select: { id: true, name: true, phone: true, status: true } } },
    });
  }

  /** Create a new survey booking linked to a lead. */
  async create(input: CreateSurveyInput) {
    // validate lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: input.leadId },
    });
    if (!lead) throw new NotFoundException(`Lead "${input.leadId}" not found`);

    return this.prisma.surveyBooking.create({
      data: {
        leadId: input.leadId,
        preferredDate: input.preferredDate,
        preferredSlot: input.preferredSlot,
        address: input.address,
        notes: input.notes,
        status: 'REQUESTED',
      },
    });
  }

  /** Get a single survey by ID. */
  async get(id: string) {
    const survey = await this.prisma.surveyBooking.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!survey) throw new NotFoundException(`Survey "${id}" not found`);
    return survey;
  }

  /** Update survey status (requested → scheduled → completed etc.). */
  async updateStatus(id: string, status: 'REQUESTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED') {
    return this.prisma.surveyBooking.update({
      where: { id },
      data: { status },
    });
  }
}