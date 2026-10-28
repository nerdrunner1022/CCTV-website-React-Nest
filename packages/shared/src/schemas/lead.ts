import { z } from 'zod';
import {
  leadSourceSchema,
  propertyTypeSchema,
  timeSlotSchema,
} from '../enums';

/**
 * Survey booking form. Keep it fillable in under 60 seconds.
 * `company` is a honeypot: real users leave it empty.
 */
export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Please enter a valid phone number')
    .max(20),
  email: z
    .union([z.string().trim().email('Please enter a valid email'), z.literal('')])
    .optional(),
  area: z.string().trim().min(2, 'Please enter your area or address').max(200),
  facilityName: z.string().trim().max(160).optional(),
  cameraCountSpec: z.string().trim().max(200).optional(),
  propertyType: propertyTypeSchema,
  preferredDate: z.string().trim().optional(),
  preferredSlot: timeSlotSchema.optional(),
  note: z.string().trim().max(1000).optional(),
  source: leadSourceSchema.optional(),
  sourceDetail: z.string().trim().max(120).optional(),
  /** honeypot — must be empty */
  company: z.string().max(0).optional(),
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadStatusSchema = z.object({
  status: z.enum([
    'NEW',
    'CONTACTED',
    'SURVEY_BOOKED',
    'QUOTED',
    'WON',
    'LOST',
    'INSTALLED',
  ]),
  note: z.string().trim().max(500).optional(),
});
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;

export const assignLeadSchema = z.object({
  /** `null` unassigns the lead. */
  assignedToId: z.string().trim().min(1).nullable(),
  note: z.string().trim().max(500).optional(),
});
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;

export const leadListQuerySchema = z.object({
  status: z.string().optional(),
  source: z.string().optional(),
  assignedToId: z.string().optional(),
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type LeadListQuery = z.infer<typeof leadListQuerySchema>;
