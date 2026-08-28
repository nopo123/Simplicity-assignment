import { ANNOUNCEMENT_SORT_BY } from '../enums/announcement.enum';
import { GetAnnouncementDto } from '../dto/get-announcement.dto';
import { SORT_ORDER } from 'src/common/enums/sort-order.enum';

export type FindPaginatedAnnouncementsArgs = {
  readonly search?: string;
  readonly categoryIds?: number[];
  readonly sortBy: ANNOUNCEMENT_SORT_BY;
  readonly sortOrder: SORT_ORDER;
  readonly page: number;
  readonly limit: number;
};

export type AnnouncementCreatedEventPayload = {
  readonly announcement: GetAnnouncementDto;
  readonly originClientId?: string;
};
