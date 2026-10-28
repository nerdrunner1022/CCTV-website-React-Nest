import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  phone: z.string().trim().min(7).max(20).optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Survey booking input – keep it simple: lead ID, preferred date/time, address. */
export const createSurveySchema = z.object({
  leadId: z.string().trim().min(1),
  preferredDate: z.string().trim().optional(),
  preferredSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING']).optional(),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});
export type CreateSurveyInput = z.infer<typeof createSurveySchema>;
