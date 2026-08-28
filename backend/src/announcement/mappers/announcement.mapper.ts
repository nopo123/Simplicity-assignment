import dayjs from 'dayjs';
import { GetAnnouncementDto } from '../dto/get-announcement.dto';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { mapCategoryEntityToDto } from 'src/category/mappers/category.mapper';
import { formatPublicationDate } from 'src/common/utils/publication-date.util';

export const mapAnnouncementEntityToDto = (
  announcement: AnnouncementEntity,
): GetAnnouncementDto => ({
  id: announcement.id,
  title: announcement.title,
  body: announcement.body,
  publicationDate: formatPublicationDate(announcement.publicationDate),
  categories: [...announcement.categories]
    .sort((first, second) => first.orderingNumber - second.orderingNumber)
    .map(mapCategoryEntityToDto),
  created: dayjs(announcement.created).toISOString(),
  updated: dayjs(announcement.updated).toISOString(),
});
