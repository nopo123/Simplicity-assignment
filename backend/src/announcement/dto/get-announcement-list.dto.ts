import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  Min,
  ValidateNested,
} from 'class-validator';
import { GetAnnouncementDto } from './get-announcement.dto';

export class GetAnnouncementListDto {
  @ApiProperty({
    description: 'Announcements on the requested page, already sorted',
    type: [GetAnnouncementDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetAnnouncementDto)
  readonly items: GetAnnouncementDto[];

  @ApiProperty({
    example: 42,
    description:
      'Number of announcements matching the search and filter, across all pages',
    type: Number,
    required: true,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly total: number;

  @ApiProperty({
    example: 1,
    description: 'One-based page number this response represents',
    type: Number,
    required: true,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({
    example: 10,
    description: 'Page size this response was built with',
    type: Number,
    required: true,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly limit: number;
}
