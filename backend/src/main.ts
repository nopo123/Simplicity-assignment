import { config } from 'dotenv';

config();

import * as fs from 'fs';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as YAML from 'yaml';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions-filter';
import {
  swaggerHelper,
  validationPipelinesHelper,
} from './common/helpers/app-create.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.disable('x-powered-by');
  validationPipelinesHelper(app);
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const swaggerDocument = swaggerHelper(app);
  if (process.env.APP_ENV === 'dev') {
    fs.writeFileSync('./swagger-spec.yaml', YAML.stringify(swaggerDocument));
  }

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
