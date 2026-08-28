import { config } from 'dotenv';

config();

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import {
  corsHelper,
  securityHardeningHelper,
  swaggerHelper,
  useGlobalFiltersHelper,
  validationPipelinesHelper,
  writeSwaggerSpecToFile,
} from './common/helpers/app-create.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  securityHardeningHelper(app);
  validationPipelinesHelper(app);
  useGlobalFiltersHelper(app);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  const swaggerDocument = swaggerHelper(app);
  writeSwaggerSpecToFile(swaggerDocument);

  corsHelper(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
