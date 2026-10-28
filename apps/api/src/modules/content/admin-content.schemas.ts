import { z } from 'zod';
import { propertyTypeSchema } from '@cctv/shared';

/**
 * Admin content input schemas. They whitelist and coerce the fields a staff
 * editor is allowed to touch — everything else (ids, timestamps, relations the
 * editor does not own) is stripped by Zod before it reaches Prisma.
 */

const emptyToNull = (value: unknown): unknown =>
  value === '' || value === undefined ? null : value;

/** Optional nullable text column (e.g. description). */
const text = (max = 2000) =>
  z.preprocess(emptyToNull, z.string().max(max).nullable().optional());

const shortText = (max = 200) =>
  z.preprocess(emptyToNull, z.string().trim().max(max).nullable().optional());

/** Optional nullable numeric column (Decimal or Float). */
const number = () =>
  z.preprocess(
    (value) =>
      value === '' || value === null || value === undefined
        ? null
        : Number(value),
    z.number().nullable().optional(),
  );

/** Optional nullable integer column. */
const int = () =>
  z.preprocess(
    (value) =>
      value === '' || value === null || value === undefined
        ? null
        : Math.trunc(Number(value)),
    z.number().int().nullable().optional(),
  );

/** Optional non-null integer column with a DB default (undefined -> default). */
const defaultInt = () =>
  z.preprocess(
    (value) =>
      value === '' || value === null || value === undefined
        ? undefined
        : Math.trunc(Number(value)),
    z.number().int().optional(),
  );

/** Optional nullable DateTime column; accepts ISO strings, '' or null. */
const date = () =>
  z.preprocess((value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = new Date(value as string);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, z.date().nullable().optional());

/** Optional Json column; empty string clears it. */
const json = () =>
  z.preprocess(
    (value) => (value === '' || value === undefined ? null : value),
    z
      .union([z.record(z.any()), z.array(z.any()), z.null()])
      .optional(),
  );

const stringList = z.array(z.string()).optional();
const currency = z.string().trim().max(8).optional();
const bool = z.boolean().optional();

const slug = z.string().trim().min(1).max(200);

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

export const productCategoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug,
  sort: defaultInt(),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug,
  sku: shortText(120),
  description: text(5000),
  categoryId: shortText(120),
  price: number(),
  currency,
  stock: defaultInt(),
  isQuoteOnly: bool,
  isActive: bool,
  specs: json(),
  images: stringList,
});

export const packageCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug,
  tier: shortText(40),
  summary: text(2000),
  image: shortText(500),
  features: stringList,
  cameraCount: int(),
  priceMin: number(),
  priceMax: number(),
  currency,
  isActive: bool,
  sort: defaultInt(),
});

export const solutionCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug,
  summary: text(2000),
  body: text(20000),
  typicalCameras: shortText(120),
  startingPrice: number(),
  currency,
  image: shortText(500),
  sort: defaultInt(),
  isActive: bool,
});

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const projectCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug,
  clientType: z.preprocess(
    emptyToNull,
    propertyTypeSchema.nullable().optional(),
  ),
  location: shortText(200),
  summary: text(5000),
  beforeImages: stringList,
  afterImages: stringList,
  testimonialId: shortText(120),
  isPublished: bool,
  sort: defaultInt(),
});

export const blogPostCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug,
  excerpt: text(500),
  body: z.string().trim().min(1),
  coverImage: shortText(500),
  tags: stringList,
  isPublished: bool,
  publishedAt: date(),
});

export const faqCreateSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1),
  category: shortText(120),
  sort: defaultInt(),
  isPublished: bool,
});

export const testimonialCreateSchema = z.object({
  author: z.string().trim().min(1).max(200),
  role: shortText(200),
  quote: z.string().trim().min(1),
  rating: int(),
  image: shortText(500),
  isPublished: bool,
});
