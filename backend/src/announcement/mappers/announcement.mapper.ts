import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { GetAnnouncementDto } from '../dto/get-announcement.dto';
import { AnnouncementEntity } from '../entities/announcement.entity';
import { mapCategoryEntityToDto } from 'src/category/mappers/category.mapper';
import { PUBLICATION_DATE_FORMAT } from 'src/common/utils/publication-date.util';

dayjs.extend(utc);

export const mapAnnouncementEntityToDto = (
  announcement: AnnouncementEntity,
): GetAnnouncementDto => ({
  id: announcement.id,
  title: announcement.title,
  body: announcement.body,
  publicationDate: dayjs
    .utc(announcement.publicationDate)
    .format(PUBLICATION_DATE_FORMAT),
  categories: [...announcement.categories]
    .sort((first, second) => first.orderingNumber - second.orderingNumber)
    .map(mapCategoryEntityToDto),
  created: dayjs(announcement.created).toISOString(),
  updated: dayjs(announcement.updated).toISOString(),
});
