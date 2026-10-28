import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  /** List all quotes (admin view). */
  async list() {
    return this.prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        lead: { select: { id: true, name: true, phone: true } },
        items: true,
      },
    });
  }

  /** Get a single quote by ID. */
  async get(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: { lead: true, items: true },
    });
    if (!quote) throw new NotFoundException(`Quote "${id}" not found`);
    return quote;
  }

  /** Create a new quote for a lead. */
  async createLeadQuote(leadId: string, items: { productId: string; quantity: number }[]) {
    // validate lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });
    if (!lead) throw new NotFoundException(`Lead "${leadId}" not found`);

    // calculate total from items
    let subtotal = 0;
    const quoteItems = [];
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new NotFoundException(`Product "${item.productId}" not found`);
      const price = product.price ?? 0;
      const qty = item.quantity ?? 1;
      const total = Number(price) * qty;
      subtotal += total;
      quoteItems.push({
        productId: item.productId,
        description: product.name,
        quantity: qty,
        unitPrice: Number(price),
        total,
      });
    }

    const quoteNumber = `QTE-${Date.now()}`;
    const taxRate = 0.1; // 10% tax
    const total = subtotal * (1 + taxRate);

    return this.prisma.quote.create({
      data: {
        number: quoteNumber,
        leadId,
        subtotal: subtotal,
        tax: Math.round(subtotal * taxRate * 100) / 100, // round to 2 decimals
        total: Math.round(total * 100) / 100, // round to 2 decimals
        currency: 'USD',
        items: {
          create: quoteItems,
        },
      },
    });
  }
}