import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementEntity } from './entities/announcement.entity';
import { CategoryRepository } from 'src/category/category.repository';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { makeUniqueArray } from 'src/common/utils/array.util';

@Injectable()
export class AnnouncementValidationService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  public async validateExistingAnnouncement(
    announcementId: number,
  ): Promise<AnnouncementEntity> {
    const announcement =
      await this.announcementRepository.findOneWithCategories(announcementId);
    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  public async validateCategories(
    categoryIds: readonly number[],
  ): Promise<CategoryEntity[]> {
    const requestedCategoryIds = makeUniqueArray(categoryIds);
    if (requestedCategoryIds.length === 0) {
      throw new BadRequestException('At least one category is required');
    }

    const categories = await this.categoryRepository.findByIds(
      requestedCategoryIds,
    );
    if (categories.length !== requestedCategoryIds.length) {
      const foundCategoryIds = categories.map((category) => category.id);
      const unknownCategoryIds = requestedCategoryIds.filter(
        (categoryId) => !foundCategoryIds.includes(categoryId),
      );

      throw new BadRequestException(
        `Unknown category ids: ${unknownCategoryIds.join(', ')}`,
      );
    }

    return categories;
  }
}
