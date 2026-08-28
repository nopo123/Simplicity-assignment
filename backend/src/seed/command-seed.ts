import { config } from 'dotenv';

config();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function runSeed() {
  const logger = new Logger('Seed');
  const application = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    await application.get(SeedService).seed();
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    await application.close();
    process.exit(1);
  }

  await application.close();
}
runSeed();
