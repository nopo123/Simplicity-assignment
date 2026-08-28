import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementValidationService } from './announcement.validation.service';
import { ANNOUNCEMENT_CREATED_EVENT } from './announcement.events';
import { ANNOUNCEMENT_PAGE_SIZE_DEFAULT } from './config/announcement-validation.config';
import { AnnouncementQueryDto } from './dto/announcement-query.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { GetAnnouncementDto } from './dto/get-announcement.dto';
import { GetAnnouncementListDto } from './dto/get-announcement-list.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { ANNOUNCEMENT_SORT_BY } from './enums/announcement.enum';
import { mapAnnouncementEntityToDto } from './mappers/announcement.mapper';
import { SORT_ORDER } from 'src/common/enums/sort-order.enum';
import { parsePublicationDate } from 'src/common/utils/publication-date.util';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly announcementValidationService: AnnouncementValidationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(query: AnnouncementQueryDto): Promise<GetAnnouncementListDto> {
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
  ): Promise<GetAnnouncementDto> {
    const categories =
      await this.announcementValidationService.validateCategories(
        createAnnouncementDto.categoryIds,
      );

    const announcement = this.announcementRepository.create({
      title: createAnnouncementDto.title,
      body: createAnnouncementDto.body,
      publicationDate: parsePublicationDate(
        createAnnouncementDto.publicationDate,
      ),
      categories,
    });
    const savedAnnouncement =
      await this.announcementRepository.save(announcement);

    const announcementDto = mapAnnouncementEntityToDto(savedAnnouncement);

    this.eventEmitter.emit(ANNOUNCEMENT_CREATED_EVENT, announcementDto);

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

    const announcementToSave = this.announcementRepository.create({
      ...announcement,
      title: updateAnnouncementDto.title ?? announcement.title,
      body: updateAnnouncementDto.body ?? announcement.body,
      publicationDate: updateAnnouncementDto.publicationDate
        ? parsePublicationDate(updateAnnouncementDto.publicationDate)
        : announcement.publicationDate,
      categories: categories ?? announcement.categories,
      updated: new Date(),
    });
    const savedAnnouncement =
      await this.announcementRepository.save(announcementToSave);

    return mapAnnouncementEntityToDto(savedAnnouncement);
  }

  async remove(announcementId: number): Promise<void> {
    const deleteResult = await this.announcementRepository.delete(
      announcementId,
    );

    if (!deleteResult.affected) {
      throw new NotFoundException('Announcement not found');
    }
  }
}
