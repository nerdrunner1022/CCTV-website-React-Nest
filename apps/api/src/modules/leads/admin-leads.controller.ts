import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  assignLeadSchema,
  createLeadSchema,
  leadListQuerySchema,
  updateLeadStatusSchema,
} from '@cctv/shared';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LeadsService } from './leads.service';

/** Staff-only lead pipeline endpoints. */
@Controller('admin/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SALES')
export class AdminLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  list(@Query() query: unknown) {
    return this.leadsService.list(leadListQuerySchema.parse(query));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: unknown) {
    return this.leadsService.createAdmin(createLeadSchema.parse(body));
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.leadsService.get(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: unknown) {
    return this.leadsService.updateStatus(id, updateLeadStatusSchema.parse(body));
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body() body: unknown) {
    return this.leadsService.assign(id, assignLeadSchema.parse(body));
  }
}
