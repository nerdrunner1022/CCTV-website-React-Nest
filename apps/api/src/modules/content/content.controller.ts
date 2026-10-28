import { Controller, Get, Param } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list() {
    return this.content.listProjects();
  }
}

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list() {
    return this.content.listTestimonials();
  }
}

@Controller('blog')
export class BlogController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list() {
    return this.content.listBlogPosts();
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.content.getBlogPost(slug);
  }
}

@Controller('faqs')
export class FaqController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list() {
    return this.content.listFaqs();
  }
}
