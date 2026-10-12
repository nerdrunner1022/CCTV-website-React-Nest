import { z } from 'zod';

/** A visitor can request a quote for one or more catalogue items. */
export const quoteRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  email: z
    .union([z.string().trim().email(), z.literal('')])
    .optional(),
  area: z.string().trim().max(200).optional(),
  note: z.string().trim().max(1000).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(100).default(1),
      }),
    )
    .min(1, 'Add at least one item to your quote'),
  source: z.string().trim().max(60).optional(),
});
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const updateQuoteStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED']),
});
export type UpdateQuoteStatusInput = z.infer<typeof updateQuoteStatusSchema>;
