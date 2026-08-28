import { PickType } from '@nestjs/swagger';
import { BaseCategoryDto } from './base-category.dto';

export class GetCategoryDto extends PickType(BaseCategoryDto, [
  'id',
  'code',
  'labels',
  'orderingNumber',
] as const) {}
