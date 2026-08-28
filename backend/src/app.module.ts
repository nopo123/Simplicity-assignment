import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AnnouncementModule } from './announcement/announcement.module';
import { CategoryModule } from './category/category.module';
import { DatabaseConfig } from './config';
import { HealthModule } from './health/health.module';
import { SeedModule } from './seed/seed.module';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    AnnouncementModule,
    CategoryModule,
    SeedModule,
    HealthModule,
  ],
})
export class AppModule {}
