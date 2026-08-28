import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ANNOUNCEMENT_TITLE_MAX_LENGTH } from '../config/announcement-validation.config';
import { BaseAbstractClass } from 'src/common/abstracts/base.class';
import { CategoryEntity } from 'src/category/entities/category.entity';

@Entity({ name: 'announcement' })
@Index('IDX_announcement_updated', ['updated'])
@Index('IDX_announcement_publication_date', ['publicationDate'])
@Index('IDX_announcement_title', ['title'])
export class AnnouncementEntity extends BaseAbstractClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'title',
    type: 'varchar',
    length: ANNOUNCEMENT_TITLE_MAX_LENGTH,
    nullable: false,
  })
  title: string;

  @Column({ name: 'body', type: 'text', nullable: false })
  body: string;

  @Column({ name: 'publicationDate', type: 'timestamptz', nullable: false })
  publicationDate: Date;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'announcement_category',
    joinColumn: { name: 'announcementId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];
}
