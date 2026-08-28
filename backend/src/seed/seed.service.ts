import { Injectable, Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { SEEDED_ANNOUNCEMENTS } from './config/seeded-announcements.config';
import { AnnouncementRepository } from 'src/announcement/announcement.repository';
import { CategoryRepository } from 'src/category/category.repository';
import { createMapFromArray } from 'src/common/utils/array.util';
import { PUBLICATION_DATE_FORMAT } from 'src/common/utils/publication-date.util';

dayjs.extend(customParseFormat);
dayjs.extend(utc);

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async seed(): Promise<void> {
    const existingAnnouncementCount = await this.announcementRepository.count();
    if (existingAnnouncementCount > 0) {
      this.logger.log('Seed skipped');

      return;
    }

    const categories = await this.categoryRepository.findAllOrdered();
    if (categories.length === 0) {
      throw new Error(
        'Categories are missing — run the migrations before seeding',
      );
    }

    const categoriesByCode = createMapFromArray(categories, 'code');

    const announcements = SEEDED_ANNOUNCEMENTS.map((seededAnnouncement) =>
      this.announcementRepository.create({
        title: seededAnnouncement.title,
        body: seededAnnouncement.body,
        publicationDate: dayjs
          .utc(
            seededAnnouncement.publicationDate,
            PUBLICATION_DATE_FORMAT,
            true,
          )
          .toDate(),
        categories: seededAnnouncement.categoryCodes.map(
          (categoryCode) => categoriesByCode[categoryCode],
        ),
      }),
    );

    await this.announcementRepository.save(announcements);

    this.logger.log(`Seeded ${announcements.length} announcements`);
  }
}
