import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';

/** Applies the shared runtime configuration to a Nest application. */
export function configureApp(app: INestApplication): INestApplication {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(cookieParser());

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: origins, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ZodExceptionFilter());

  return app;
}
