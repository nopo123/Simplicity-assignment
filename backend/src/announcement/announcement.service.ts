import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource, EntityManager } from 'typeorm';
import dayjs from 'dayjs';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementValidationService } from './announcement.validation.service';
import { ANNOUNCEMENT_CREATED_EVENT } from './announcement.events';
import { ANNOUNCEMENT_PAGE_SIZE_DEFAULT } from './config/announcement-validation.config';
import { AnnouncementQueryDto } from './dto/announcement-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { GetAnnouncementDto } from './dto/get-announcement.dto';
import { GetAnnouncementListDto } from './dto/get-announcement-list.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementEntity } from './entities/announcement.entity';
import { ANNOUNCEMENT_SORT_BY } from './enums/announcement.enum';
import { SORT_ORDER } from 'src/common/enums/sort-order.enum';
import { mapAnnouncementEntityToDto } from './mappers/announcement.mapper';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly announcementValidationService: AnnouncementValidationService,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(
    query: AnnouncementQueryDto,
  ): Promise<GetAnnouncementListDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? ANNOUNCEMENT_PAGE_SIZE_DEFAULT;

    const [announcements, total] =
      await this.announcementRepository.findPaginated({
        search: query.search,
        categoryIds: query.categoryIds,
        sortBy: query.sortBy ?? ANNOUNCEMENT_SORT_BY.LAST_UPDATE,
        sortOrder: query.sortOrder ?? SORT_ORDER.DESC,
        page,
        limit,
      });

    return {
      items: announcements.map(mapAnnouncementEntityToDto),
      total,
      page,
      limit,
    };
  }

  async findOne(announcementId: number): Promise<GetAnnouncementDto> {
    const announcement =
      await this.announcementValidationService.validateExistingAnnouncement(
        announcementId,
      );

    return mapAnnouncementEntityToDto(announcement);
  }

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    originClientId?: string,
  ): Promise<GetAnnouncementDto> {
    const categories =
      await this.announcementValidationService.validateCategories(
        createAnnouncementDto.categoryIds,
      );

    const announcement = this.announcementRepository.create({
      title: createAnnouncementDto.title,
      body: createAnnouncementDto.body,
      publicationDate: dayjs(createAnnouncementDto.publicationDate).toDate(),
      categories,
    });
    const savedAnnouncement =
      await this.announcementRepository.save(announcement);

    const announcementDto = mapAnnouncementEntityToDto(savedAnnouncement);

    this.eventEmitter.emit(ANNOUNCEMENT_CREATED_EVENT, {
      announcement: announcementDto,
      originClientId,
    });

    return announcementDto;
  }

  async update(
    announcementId: number,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<GetAnnouncementDto> {
    const announcement =
      await this.announcementValidationService.validateExistingAnnouncement(
        announcementId,
      );

    const categories = updateAnnouncementDto.categoryIds
      ? await this.announcementValidationService.validateCategories(
          updateAnnouncementDto.categoryIds,
        )
      : null;

    const updatedAnnouncement = await this.dataSource.transaction(
      (entityManager) =>
        this.updateWithManager(
          entityManager,
          announcement,
          updateAnnouncementDto,
          categories,
        ),
    );

    return mapAnnouncementEntityToDto(updatedAnnouncement);
  }

  async remove(announcementId: number): Promise<void> {
    const announcement =
      await this.announcementValidationService.validateExistingAnnouncement(
        announcementId,
      );

    await this.announcementRepository.delete(announcement.id);
  }

  private async updateWithManager(
    entityManager: EntityManager,
    announcement: AnnouncementEntity,
    updateAnnouncementDto: UpdateAnnouncementDto,
    categories: CategoryEntity[] | null,
  ): Promise<AnnouncementEntity> {
    const announcementRepository =
      entityManager.getRepository(AnnouncementEntity);

    const announcementToSave = announcementRepository.create({
      ...announcement,
      title: updateAnnouncementDto.title ?? announcement.title,
      body: updateAnnouncementDto.body ?? announcement.body,
      publicationDate: updateAnnouncementDto.publicationDate
        ? dayjs(updateAnnouncementDto.publicationDate).toDate()
        : announcement.publicationDate,
      categories: categories ?? announcement.categories,
    });
    await announcementRepository.save(announcementToSave);

    const updated = await this.touchUpdatedTimestampWithManager(
      entityManager,
      announcement.id,
    );

    return announcementRepository.create({ ...announcementToSave, updated });
  }

  private async touchUpdatedTimestampWithManager(
    entityManager: EntityManager,
    announcementId: number,
  ): Promise<Date> {
    const rows = await entityManager.query(
      'UPDATE announcement SET updated = CURRENT_TIMESTAMP WHERE id = $1 RETURNING updated',
      [announcementId],
    );

    return rows[0].updated;
  }
}
