import { PickType } from '@nestjs/swagger';
import { BaseAnnouncementDto } from './base-announcement.dto';

export class CreateAnnouncementDto extends PickType(BaseAnnouncementDto, [
  'title',
  'body',
  'publicationDate',
  'categoryIds',
] as const) {}
