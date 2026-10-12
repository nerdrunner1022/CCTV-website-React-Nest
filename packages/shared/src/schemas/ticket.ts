import { z } from 'zod';
import { ticketCategorySchema } from '../enums';

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3).max(160),
  category: ticketCategorySchema.default('OTHER'),
  body: z.string().trim().min(5).max(4000),
  attachments: z.array(z.string().url()).max(5).optional(),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const addTicketMessageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  attachments: z.array(z.string().url()).max(5).optional(),
});
export type AddTicketMessageInput = z.infer<typeof addTicketMessageSchema>;
