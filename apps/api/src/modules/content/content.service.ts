import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  listProjects() {
    return this.prisma.project.findMany({
      where: { isPublished: true },
      include: { testimonial: true },
      orderBy: { sort: 'asc' },
    });
  }

  listTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  listBlogPosts() {
    return this.prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async getBlogPost(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Blog post "${slug}" not found`);
    return post;
  }

  listFaqs() {
    return this.prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { sort: 'asc' },
    });
  }
}
