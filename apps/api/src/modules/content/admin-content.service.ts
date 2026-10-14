import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import { PrismaService } from '../../prisma/prisma.service';
import {
  blogPostCreateSchema,
  faqCreateSchema,
  packageCreateSchema,
  productCategoryCreateSchema,
  productCreateSchema,
  projectCreateSchema,
  solutionCreateSchema,
  testimonialCreateSchema,
} from './admin-content.schemas';

/** Loose Prisma delegate shape so the registry can stay data-driven. */
interface Delegate {
  findMany: (args?: unknown) => Promise<unknown>;
  findUnique: (args: unknown) => Promise<unknown>;
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
  delete: (args: unknown) => Promise<unknown>;
}

interface ResourceDef {
  label: string;
  delegate: Delegate;
  create: ZodObject<ZodRawShape>;
  update: ZodTypeAny;
  orderBy: unknown;
  include?: unknown;
}

/**
 * Whitelisted content resources exposed at `/admin/content/:resource`.
 * Adding a resource here is all it takes to get list/get/create/update/delete
 * plus a generic editor in the admin portal.
 */
function buildRegistry(prisma: PrismaService): Record<string, ResourceDef> {
  const define = (
    label: string,
    delegate: unknown,
    create: ZodObject<ZodRawShape>,
    orderBy: unknown,
    include?: unknown,
  ): ResourceDef => ({
    label,
    delegate: delegate as Delegate,
    create,
    update: create.partial(),
    orderBy,
    include,
  });

  return {
    'product-categories': define(
      'Product categories',
      prisma.productCategory,
      productCategoryCreateSchema,
      { sort: 'asc' },
    ),
    products: define(
      'Products',
      prisma.product,
      productCreateSchema,
      { createdAt: 'desc' },
      { category: true },
    ),
    packages: define('Packages', prisma.package, packageCreateSchema, {
      sort: 'asc',
    }),
    solutions: define('Solutions', prisma.solution, solutionCreateSchema, {
      sort: 'asc',
    }),
    projects: define('Projects', prisma.project, projectCreateSchema, {
      sort: 'asc',
    }, { testimonial: true }),
    blog: define('Blog posts', prisma.blogPost, blogPostCreateSchema, {
      publishedAt: 'desc',
    }),
    faqs: define('FAQs', prisma.faq, faqCreateSchema, { sort: 'asc' }),
    testimonials: define(
      'Testimonials',
      prisma.testimonial,
      testimonialCreateSchema,
      { createdAt: 'desc' },
    ),
  };
}

@Injectable()
export class AdminContentService {
  private readonly registry: Record<string, ResourceDef>;

  constructor(private readonly prisma: PrismaService) {
    this.registry = buildRegistry(prisma);
  }

  private resource(key: string): ResourceDef {
    const def = this.registry[key];
    if (!def) throw new NotFoundException(`Unknown resource "${key}"`);
    return def;
  }

  list(key: string) {
    const { delegate, orderBy, include } = this.resource(key);
    return delegate.findMany({ orderBy, include });
  }

  async get(key: string, id: string) {
    const { delegate, include } = this.resource(key);
    const item = await delegate.findUnique({ where: { id }, include });
    if (!item) throw new NotFoundException('Record not found');
    return item;
  }

  async create(key: string, body: unknown) {
    const { delegate, create } = this.resource(key);
    const data = create.parse(body);
    return this.guardUnique(() => delegate.create({ data }));
  }

  async update(key: string, id: string, body: unknown) {
    const { delegate, update } = this.resource(key);
    const data = update.parse(body);
    return this.guardUnique(() => delegate.update({ where: { id }, data }));
  }

  remove(key: string, id: string) {
    const { delegate } = this.resource(key);
    return delegate.delete({ where: { id } });
  }

  /** Translate unique-constraint violations (slug/sku) into a clean 409. */
  private async guardUnique<T>(run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[] | undefined)?.join(', ');
        throw new ConflictException(
          target
            ? `A record with this ${target} already exists`
            : 'A record with these values already exists',
        );
      }
      throw error;
    }
  }
}
