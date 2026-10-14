import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminContentService } from './admin-content.service';

/**
 * Generic staff-only CMS. `/admin/content/products`, `/admin/content/blog`, etc.
 * Resource keys and their editable fields live in `admin-content.service.ts`.
 */
@Controller('admin/content')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SALES')
export class AdminContentController {
  constructor(private readonly content: AdminContentService) {}

  @Get(':resource')
  list(@Param('resource') resource: string) {
    return this.content.list(resource);
  }

  @Get(':resource/:id')
  get(@Param('resource') resource: string, @Param('id') id: string) {
    return this.content.get(resource, id);
  }

  @Post(':resource')
  create(@Param('resource') resource: string, @Body() body: unknown) {
    return this.content.create(resource, body);
  }

  @Patch(':resource/:id')
  update(
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.content.update(resource, id, body);
  }

  @Delete(':resource/:id')
  remove(@Param('resource') resource: string, @Param('id') id: string) {
    return this.content.remove(resource, id);
  }
}
