import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    categoryRepository: Repository<CategoryEntity>,
  ) {
    super(
      categoryRepository.target,
      categoryRepository.manager,
      categoryRepository.queryRunner,
    );
  }

  public async findAllOrdered(): Promise<CategoryEntity[]> {
    return this.find({ order: { orderingNumber: 'ASC', id: 'ASC' } });
  }

  public async findByIds(ids: readonly number[]): Promise<CategoryEntity[]> {
    if (ids.length === 0) return [];

    return this.find({
      where: { id: In([...ids]) },
      order: { orderingNumber: 'ASC', id: 'ASC' },
    });
  }

}
