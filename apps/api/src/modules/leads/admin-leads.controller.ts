import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { leadListQuerySchema, updateLeadStatusSchema } from '@cctv/shared';
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

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: unknown) {
    return this.leadsService.updateStatus(id, updateLeadStatusSchema.parse(body));
  }
}
