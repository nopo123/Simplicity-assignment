import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { GetCategoryDto } from './dto/get-category.dto';
import { mapCategoryEntityToDto } from './mappers/category.mapper';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<GetCategoryDto[]> {
    const categories = await this.categoryRepository.findAllOrdered();

    return categories.map(mapCategoryEntityToDto);
  }
}
