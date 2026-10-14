import { Module } from '@nestjs/common';
import { AdminContentController } from './admin-content.controller';
import { AdminContentService } from './admin-content.service';
import {
  BlogController,
  FaqController,
  ProjectsController,
  TestimonialsController,
} from './content.controller';
import { ContentService } from './content.service';

@Module({
  controllers: [
    ProjectsController,
    TestimonialsController,
    BlogController,
    FaqController,
    AdminContentController,
  ],
  providers: [ContentService, AdminContentService],
  exports: [ContentService, AdminContentService],
})
export class ContentModule {}
