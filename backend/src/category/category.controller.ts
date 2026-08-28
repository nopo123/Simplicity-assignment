import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { GetCategoryDto } from './dto/get-category.dto';
import { RestApiResponseArray } from 'src/common/decorators/api-response-array.decorator';

@Controller({
  version: '1',
  path: 'categories',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @RestApiResponseArray(
    GetCategoryDto,
    'Get all announcement categories',
    'Categories have been fetched successfully',
    'Lists every announcement category. Categories are fixed reference data seeded by a migration, so this endpoint is read-only. The order returned is the order selectors should render, alphabetical by the English label.',
    'Category',
  )
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<GetCategoryDto[]> {
    return this.categoryService.findAll();
  }
}
