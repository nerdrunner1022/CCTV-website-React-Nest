import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listSolutions() {
    return this.prisma.solution.findMany({
      where: { isActive: true },
      orderBy: { sort: 'asc' },
    });
  }

  getSolution(slug: string) {
    return this.prisma.solution.findUnique({ where: { slug } });
  }

  listPackages() {
    return this.prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sort: 'asc' },
    });
  }

  listProducts(params: { category?: string }) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        ...(params.category ? { category: { slug: params.category } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  getProduct(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  }
}
