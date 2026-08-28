import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ANNOUNCEMENT_PAGE_SIZE_DEFAULT,
  ANNOUNCEMENT_PAGE_SIZE_MAX,
  ANNOUNCEMENT_SEARCH_MAX_LENGTH,
} from '../config/announcement-validation.config';
import { ANNOUNCEMENT_SORT_BY } from '../enums/announcement.enum';
import { SORT_ORDER } from 'src/common/enums/sort-order.enum';
import { toNumberArray } from 'src/common/helpers/dto.helper';

export class AnnouncementQueryDto {
  @ApiPropertyOptional({
    example: 'water supply',
    description: `Case-insensitive text search matched against the title and the body. Wildcard characters are treated literally, so a term containing % or _ finds those characters. At most ${ANNOUNCEMENT_SEARCH_MAX_LENGTH} characters.`,
    type: String,
    maxLength: ANNOUNCEMENT_SEARCH_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(ANNOUNCEMENT_SEARCH_MAX_LENGTH)
  @Type(() => String)
  readonly search?: string;

  @ApiPropertyOptional({
    example: [1, 8],
    description:
      'Keeps only announcements that carry at least one of these categories. Accepts a repeated parameter or one comma-separated value. Filtered announcements still return their full category list.',
    type: [Number],
  })
  @IsOptional()
  @Transform(toNumberArray)
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  readonly categoryIds?: number[];

  @ApiPropertyOptional({
    example: ANNOUNCEMENT_SORT_BY.LAST_UPDATE,
    description:
      'Column the list is sorted by. Defaults to LAST_UPDATE, which is the order the announcements table renders.',
    enum: ANNOUNCEMENT_SORT_BY,
    default: ANNOUNCEMENT_SORT_BY.LAST_UPDATE,
  })
  @IsOptional()
  @IsString()
  @IsEnum(ANNOUNCEMENT_SORT_BY)
  @Type(() => String)
  readonly sortBy?: ANNOUNCEMENT_SORT_BY;

  @ApiPropertyOptional({
    example: SORT_ORDER.DESC,
    description: 'Sort direction. Defaults to DESC.',
    enum: SORT_ORDER,
    default: SORT_ORDER.DESC,
  })
  @IsOptional()
  @IsString()
  @IsEnum(SORT_ORDER)
  @Type(() => String)
  readonly sortOrder?: SORT_ORDER;

  @ApiPropertyOptional({
    example: 1,
    description: 'One-based page number. Defaults to 1.',
    type: Number,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional({
    example: ANNOUNCEMENT_PAGE_SIZE_DEFAULT,
    description: `Page size, from 1 to ${ANNOUNCEMENT_PAGE_SIZE_MAX}. Defaults to ${ANNOUNCEMENT_PAGE_SIZE_DEFAULT}.`,
    type: Number,
    minimum: 1,
    maximum: ANNOUNCEMENT_PAGE_SIZE_MAX,
    default: ANNOUNCEMENT_PAGE_SIZE_DEFAULT,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(ANNOUNCEMENT_PAGE_SIZE_MAX)
  @Type(() => Number)
  readonly limit?: number;
}
