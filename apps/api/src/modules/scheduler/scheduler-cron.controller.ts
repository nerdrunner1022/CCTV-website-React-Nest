import { Controller, Get, Logger } from '@nestjs/common';

/**
 * Endpoint hit by Vercel Cron once a day. Scans for overdue leads and
 * expiring AMC contracts. (Business logic lands in Phase 2/4.)
 */
@Controller('cron')
export class SchedulerCronController {
  private readonly logger = new Logger(SchedulerCronController.name);

  @Get('daily')
  daily(): { ok: true; ranAt: string } {
    this.logger.log('Daily sweep triggered');
    return { ok: true, ranAt: new Date().toISOString() };
  }
}
