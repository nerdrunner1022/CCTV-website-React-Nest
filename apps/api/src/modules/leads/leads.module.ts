import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminLeadsController } from './admin-leads.controller';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [NotificationsModule, SchedulerModule],
  controllers: [
    LeadsController,
    AdminLeadsController,
    AdminDashboardController,
  ],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
