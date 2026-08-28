import { PickType } from '@nestjs/swagger';
import { BaseAnnouncementDto } from './base-announcement.dto';

export class GetAnnouncementDto extends PickType(BaseAnnouncementDto, [
  'id',
  'title',
  'body',
  'publicationDate',
  'categories',
  'created',
  'updated',
] as const) {}
