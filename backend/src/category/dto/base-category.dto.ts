import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CATEGORY_CODE } from '../enums/category.enum';
import { IdBaseDto } from 'src/common/dto/base.dto';
import { TranslationDto } from 'src/common/dto/translation.dto';

export class BaseCategoryDto extends IntersectionType(IdBaseDto) {
  @ApiProperty({
    example: CATEGORY_CODE.CITY,
    description:
      'Stable machine identifier of the category. Reference data seeded by a migration — clients match on this, never on the label.',
    enum: CATEGORY_CODE,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CATEGORY_CODE)
  @Type(() => String)
  readonly code: CATEGORY_CODE;

  @ApiProperty({
    description:
      'Displayed name of the category per language. The client picks the language it renders in and falls back to English.',
    type: TranslationDto,
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslationDto)
  readonly labels: TranslationDto;

  @ApiProperty({
    example: 1,
    description:
      'Position of the category in selectors. Categories are returned in this order, which is alphabetical by the English label.',
    type: Number,
    required: true,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly orderingNumber: number;
}
