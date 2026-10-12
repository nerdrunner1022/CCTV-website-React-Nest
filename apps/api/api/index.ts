import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app-setup';

/**
 * Vercel serverless entrypoint.
 * The Nest application is created once and cached for the lifetime of the
 * (possibly warm) function instance.
 */
let cachedApp: INestApplication | null = null;

async function bootstrap(): Promise<INestApplication> {
  if (cachedApp) return cachedApp;

  const app = configureApp(
    await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] }),
  );
  await app.init();

  cachedApp = app;
  return app;
}

export default async function handler(req: unknown, res: unknown): Promise<void> {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance() as (
    request: unknown,
    response: unknown,
  ) => void;
  instance(req, res);
}
