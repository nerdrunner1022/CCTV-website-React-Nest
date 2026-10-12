import { z } from 'zod';

/**
 * Enums are declared as Zod schemas so they are the single source of truth for
 * both runtime validation and the TypeScript union types used across web + api.
 */

export const userRoleSchema = z.enum([
  'ADMIN',
  'SALES',
  'TECHNICIAN',
  'CUSTOMER',
]);
export type UserRole = z.infer<typeof userRoleSchema>;
export const USER_ROLES = userRoleSchema.options;

export const leadStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'SURVEY_BOOKED',
  'QUOTED',
  'WON',
  'LOST',
  'INSTALLED',
]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export const LEAD_STATUSES = leadStatusSchema.options;

/** Human-friendly labels for the admin pipeline board. */
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  SURVEY_BOOKED: 'Survey Booked',
  QUOTED: 'Quoted',
  WON: 'Won',
  LOST: 'Lost',
  INSTALLED: 'Installed',
};

export const propertyTypeSchema = z.enum([
  'HOME',
  'SHOP',
  'RESTAURANT',
  'OFFICE',
  'WAREHOUSE',
  'OTHER',
]);
export type PropertyType = z.infer<typeof propertyTypeSchema>;
export const PROPERTY_TYPES = propertyTypeSchema.options;

export const leadSourceSchema = z.enum([
  'GOOGLE',
  'FACEBOOK',
  'INSTAGRAM',
  'REFERRAL',
  'FLYER_QR',
  'VAN_QR',
  'WHATSAPP',
  'DIRECT',
  'OTHER',
]);
export type LeadSource = z.infer<typeof leadSourceSchema>;
export const LEAD_SOURCES = leadSourceSchema.options;

export const timeSlotSchema = z.enum(['MORNING', 'AFTERNOON', 'EVENING']);
export type TimeSlot = z.infer<typeof timeSlotSchema>;

export const surveyStatusSchema = z.enum([
  'REQUESTED',
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
]);
export type SurveyStatus = z.infer<typeof surveyStatusSchema>;

export const quoteStatusSchema = z.enum([
  'DRAFT',
  'SENT',
  'ACCEPTED',
  'DECLINED',
  'EXPIRED',
]);
export type QuoteStatus = z.infer<typeof quoteStatusSchema>;

export const ticketStatusSchema = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'WAITING_ON_CUSTOMER',
  'RESOLVED',
  'CLOSED',
]);
export type TicketStatus = z.infer<typeof ticketStatusSchema>;

export const ticketCategorySchema = z.enum([
  'CAMERA_OFFLINE',
  'REMOTE_VIEWING',
  'RECORDING_ISSUE',
  'POWER_ISSUE',
  'BILLING',
  'OTHER',
]);
export type TicketCategory = z.infer<typeof ticketCategorySchema>;
