import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('HimnovaLaunchpadBootstrap');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Dynamic CORS from FRONTEND_URL & production domains
  const configuredFrontends = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  const allowedOrigins = Array.from(
    new Set([
      ...configuredFrontends,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://learn.himnovatech.com',
      'https://academy.himnovatech.com',
      'https://himnovatech.com',
    ])
  );

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  });


  // Global Validation Pipe with automatic transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Global Interceptor and Exception Filter
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Himnova AI Career Launchpad API')
    .setDescription(
      'Official enterprise REST API for Himnova AI Career Launchpad (LMS, Batches, Live Classes, AI Tutor, eSewa/Khalti Payments, Certificates & Portfolios)'
    )
    .setVersion('2.6.0')
    .addBearerAuth()
    .addTag('Authentication')
    .addTag('Courses')
    .addTag('Lessons')
    .addTag('Batches')
    .addTag('Enrollments')
    .addTag('Assignments')
    .addTag('Submissions')
    .addTag('Attendance')
    .addTag('LiveClasses')
    .addTag('Payments')
    .addTag('Coupons')
    .addTag('Referrals')
    .addTag('Certificates')
    .addTag('Portfolios')
    .addTag('Analytics')
    .addTag('AI')
    .addTag('Users')
    .addTag('Audit')
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 Himnova Launchpad API running at: http://localhost:${port}/api/v1`);
  logger.log(`📖 Swagger API Docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
