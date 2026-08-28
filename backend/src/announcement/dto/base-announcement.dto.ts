import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsISO8601,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsPublicationDate } from 'src/common/helpers/dto.helper';
import { PUBLICATION_DATE_FORMAT } from 'src/common/utils/publication-date.util';
import {
  ANNOUNCEMENT_BODY_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from '../config/announcement-validation.config';
import { GetCategoryDto } from 'src/category/dto/get-category.dto';
import { IdBaseDto } from 'src/common/dto/base.dto';

export class BaseAnnouncementDto extends IntersectionType(IdBaseDto) {
  @ApiProperty({
    example: 'Water supply interruption in the city centre',
    description: `Headline of the announcement, at most ${ANNOUNCEMENT_TITLE_MAX_LENGTH} characters. Matched by the text search together with the body.`,
    type: String,
    required: true,
    maxLength: ANNOUNCEMENT_TITLE_MAX_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(ANNOUNCEMENT_TITLE_MAX_LENGTH)
  @Type(() => String)
  readonly title: string;

  @ApiProperty({
    example:
      'Water will be shut off on Main Street between 8:00 and 14:00 while the main pipe is replaced.',
    description: `Full text of the announcement, at most ${ANNOUNCEMENT_BODY_MAX_LENGTH} characters. Matched by the text search together with the title.`,
    type: String,
    required: true,
    maxLength: ANNOUNCEMENT_BODY_MAX_LENGTH,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(ANNOUNCEMENT_BODY_MAX_LENGTH)
  @Type(() => String)
  readonly body: string;

  @ApiProperty({
    example: '08/28/2026 08:55',
    description: `Date and time the announcement is published, in the ${PUBLICATION_DATE_FORMAT} format and interpreted as UTC. Each part is validated on its own, so an out of range month, day, hour or minute is reported separately from a malformed value. The frontend runs the identical check before sending.`,
    type: String,
    required: true,
  })
  @IsPublicationDate()
  @Type(() => String)
  readonly publicationDate: string;

  @ApiProperty({
    example: [1, 2],
    description:
      'Ids of the categories the announcement belongs to. At least one category is required and every id must exist. On update the whole set is replaced, not merged.',
    type: [Number],
    required: true,
    minItems: 1,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Type(() => Number)
  readonly categoryIds: number[];

  @ApiProperty({
    description:
      'Categories the announcement belongs to, ordered the same way as the category list endpoint. Response-only — send categoryIds on write.',
    type: [GetCategoryDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetCategoryDto)
  readonly categories: GetCategoryDto[];

  @ApiProperty({
    example: '2026-08-28T08:55:00.000Z',
    description:
      'Moment the announcement was created, in ISO 8601. Response-only.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => String)
  readonly created: string;

  @ApiProperty({
    example: '2026-08-28T09:12:00.000Z',
    description:
      'Moment the announcement was last changed, in ISO 8601. Response-only, and the default sort key of the list endpoint. Replacing only the categories still moves this forward.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsISO8601()
  @Type(() => String)
  readonly updated: string;
}
