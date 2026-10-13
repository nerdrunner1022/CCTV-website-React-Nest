import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getSolution(slug: string) {
    const solution = await this.prisma.solution.findUnique({ where: { slug } });
    if (!solution) throw new NotFoundException(`Solution "${slug}" not found`);
    return solution;
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

  async getProduct(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product "${slug}" not found`);
    return product;
  }
}
