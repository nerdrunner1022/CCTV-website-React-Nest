import { Module } from '@nestjs/common';
import {
  PackagesController,
  ProductsController,
  SolutionsController,
} from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  controllers: [SolutionsController, PackagesController, ProductsController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
