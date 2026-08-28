import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { flattenValidationErrors } from './dto.helper';

export const validationPipelinesHelper = (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
      stopAtFirstError: false,
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
