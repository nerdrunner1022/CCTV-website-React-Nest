import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LeadsService } from './leads.service';

/** Staff-only dashboard metrics. */
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SALES')
export class AdminDashboardController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get('metrics')
  metrics() {
    return this.leadsService.metrics();
  }
}
