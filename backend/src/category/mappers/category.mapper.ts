import { GetCategoryDto } from '../dto/get-category.dto';
import { CategoryEntity } from '../entities/category.entity';

export const mapCategoryEntityToDto = (
  category: CategoryEntity,
): GetCategoryDto => ({
  id: category.id,
  code: category.code,
  labels: category.labels,
  orderingNumber: category.orderingNumber,
});
