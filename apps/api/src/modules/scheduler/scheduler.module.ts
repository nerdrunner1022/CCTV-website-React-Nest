import { Module } from '@nestjs/common';
import { SchedulerCronController } from './scheduler-cron.controller';
import { SchedulerService } from './scheduler.service';

@Module({
  controllers: [SchedulerCronController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
