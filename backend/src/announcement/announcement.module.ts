import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementService } from './announcement.service';
import { AnnouncementValidationService } from './announcement.validation.service';
import { AnnouncementEntity } from './entities/announcement.entity';
import { AnnouncementGateway } from './gateway/announcement.gateway';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([AnnouncementEntity]), CategoryModule],
  controllers: [AnnouncementController],
  providers: [
    AnnouncementService,
    AnnouncementRepository,
    AnnouncementValidationService,
    AnnouncementGateway,
  ],
  exports: [AnnouncementRepository],
})
export class AnnouncementModule {}
