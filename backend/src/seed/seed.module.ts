import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AnnouncementModule } from 'src/announcement/announcement.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [AnnouncementModule, CategoryModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
