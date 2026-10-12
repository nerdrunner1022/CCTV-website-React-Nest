import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AmcModule } from './modules/amc/amc.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { CalculatorModule } from './modules/calculator/calculator.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ContentModule } from './modules/content/content.module';
import { CustomersModule } from './modules/customers/customers.module';
import { FilesModule } from './modules/files/files.module';
import { HealthModule } from './modules/health/health.module';
import { LeadsModule } from './modules/leads/leads.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { SurveysModule } from './modules/surveys/surveys.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    // In-memory throttling for local dev. On Vercel this must be backed by
    // Upstash Ratelimit, since function instances do not share memory.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),

    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    CatalogModule,
    ContentModule,
    LeadsModule,
    SurveysModule,
    QuotesModule,
    TicketsModule,
    AmcModule,
    BillingModule,
    NotificationsModule,
    SchedulerModule,
    CalculatorModule,
    AnalyticsModule,
    FilesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
