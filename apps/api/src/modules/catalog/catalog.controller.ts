import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('solutions')
export class SolutionsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  list() {
    return this.catalog.listSolutions();
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.catalog.getSolution(slug);
  }
}

@Controller('packages')
export class PackagesController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  list() {
    return this.catalog.listPackages();
  }
}

@Controller('products')
export class ProductsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  list(@Query('category') category?: string) {
    return this.catalog.listProducts({ category });
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.catalog.getProduct(slug);
  }
}
