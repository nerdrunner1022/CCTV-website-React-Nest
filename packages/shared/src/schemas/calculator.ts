import { z } from 'zod';
import { propertyTypeSchema } from '../enums';

/**
 * Camera calculator input — 4-5 quick questions, answered without thinking.
 * The estimate is produced by a deterministic rule engine (no AI).
 */
export const calculatorInputSchema = z.object({
  propertyType: propertyTypeSchema,
  entrances: z.number().int().min(1).max(20),
  coverage: z.enum(['INDOOR', 'OUTDOOR', 'MIXED']),
  budget: z.enum(['LOW', 'MID', 'HIGH', 'UNSURE']),
  existingCameras: z.boolean().default(false),
});
export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export const calculatorResultSchema = z.object({
  suggestedPackage: z.string(),
  cameraCount: z.number().int().min(1),
  priceMin: z.number(),
  priceMax: z.number(),
  currency: z.string(),
  rationale: z.array(z.string()),
});
export type CalculatorResult = z.infer<typeof calculatorResultSchema>;
