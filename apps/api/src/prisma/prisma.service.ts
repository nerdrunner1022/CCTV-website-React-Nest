import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma client bound to the pooled Neon connection (`DATABASE_URL`).
 *
 * For maximum serverless connection efficiency the Neon driver adapter can be
 * layered on later (`@prisma/adapter-neon` + `@neondatabase/serverless`); the
 * pooled connection string already prevents connection exhaustion for now.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
