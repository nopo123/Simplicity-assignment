import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CATEGORY_CODE } from '../enums/category.enum';
import { CATEGORY_CODE_MAX_LENGTH } from '../config/seeded-categories.config';
import { BaseAbstractClass } from 'src/common/abstracts/base.class';
import { TranslationDto } from 'src/common/dto/translation.dto';

@Entity({ name: 'category' })
@Unique('UQ_category_code', ['code'])
export class CategoryEntity extends BaseAbstractClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: CATEGORY_CODE_MAX_LENGTH,
    nullable: false,
  })
  code: CATEGORY_CODE;

  @Column({ name: 'labels', type: 'jsonb', nullable: false })
  labels: TranslationDto;

  @Column({ name: 'orderingNumber', type: 'int', nullable: false })
  orderingNumber: number;
}
