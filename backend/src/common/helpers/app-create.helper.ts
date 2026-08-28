import * as fs from 'fs';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yaml';
import { AllExceptionsFilter } from '../filters/all-exceptions-filter';
import { flattenValidationErrors } from './dto.helper';

export const validationPipelinesHelper = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
      stopAtFirstError: true,
      errorHttpStatusCode: 400,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new BadRequestException(
          flattenValidationErrors(validationErrors),
        );
      },
    }),
  );

  return app;
};

export const useGlobalFiltersHelper = (app: NestExpressApplication) => {
  app.useGlobalFilters(new AllExceptionsFilter());

  return app;
};

export const securityHardeningHelper = (app: NestExpressApplication) => {
  app.disable('x-powered-by');

  return app;
};

export const corsHelper = (app: NestExpressApplication) => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (!allowedOrigins) {
    throw new Error('CORS_ALLOWED_ORIGINS environment variable is not set');
  }

  app.enableCors({
    origin: allowedOrigins.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  return app;
};

export const swaggerHelper = (app: NestExpressApplication): OpenAPIObject => {
  const options = new DocumentBuilder()
    .setTitle('Announcements')
    .setDescription('Announcements API description')
    .setVersion('1.0')
    .addTag('announcements')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  return document;
};

export const writeSwaggerSpecToFile = (document: OpenAPIObject): void => {
  fs.writeFileSync('./swagger-spec.yaml', YAML.stringify(document));
};
