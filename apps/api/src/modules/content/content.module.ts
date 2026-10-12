import { Module } from '@nestjs/common';
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
  ],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
