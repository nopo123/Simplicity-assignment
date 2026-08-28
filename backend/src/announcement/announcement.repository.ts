import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { ANNOUNCEMENT_SORT_BY } from './enums/announcement.enum';
import { FindPaginatedAnnouncementsArgs } from './types/announcement.types';
import { buildLikePattern } from './utils/search-term.util';

const ANNOUNCEMENT_SORT_COLUMNS: Record<ANNOUNCEMENT_SORT_BY, string> = {
  [ANNOUNCEMENT_SORT_BY.LAST_UPDATE]: 'announcement.updated',
  [ANNOUNCEMENT_SORT_BY.PUBLICATION_DATE]: 'announcement.publicationDate',
  [ANNOUNCEMENT_SORT_BY.TITLE]: 'announcement.title',
};

const CATEGORY_FILTER_SUBQUERY =
  'announcement.id IN (SELECT announcement_category."announcementId" FROM announcement_category WHERE announcement_category."categoryId" IN (:...categoryIds))';

@Injectable()
export class AnnouncementRepository extends Repository<AnnouncementEntity> {
  constructor(
    @InjectRepository(AnnouncementEntity)
    announcementRepository: Repository<AnnouncementEntity>,
  ) {
    super(
      announcementRepository.target,
      announcementRepository.manager,
      announcementRepository.queryRunner,
    );
  }

  public async findPaginated(
    args: FindPaginatedAnnouncementsArgs,
  ): Promise<[AnnouncementEntity[], number]> {
    const queryBuilder = this.createQueryBuilder('announcement').leftJoinAndSelect(
      'announcement.categories',
      'category',
    );

    if (args.search) {
      const search = buildLikePattern(args.search);
      queryBuilder.andWhere(
        new Brackets((where) => {
          where
            .where('announcement.title ILIKE :search', { search })
            .orWhere('announcement.body ILIKE :search', { search });
        }),
      );
    }

    if (args.categoryIds?.length) {
      queryBuilder.andWhere(CATEGORY_FILTER_SUBQUERY, {
        categoryIds: args.categoryIds,
      });
    }

    queryBuilder
      .orderBy(ANNOUNCEMENT_SORT_COLUMNS[args.sortBy], args.sortOrder)
      .addOrderBy('announcement.id', args.sortOrder)
      .addOrderBy('category.orderingNumber', 'ASC')
      .skip((args.page - 1) * args.limit)
      .take(args.limit);

    return queryBuilder.getManyAndCount();
  }

  public async findOneWithCategories(
    announcementId: number,
  ): Promise<AnnouncementEntity> {
    return this.findOne({
      where: { id: announcementId },
      relations: { categories: true },
      order: { categories: { orderingNumber: 'ASC' } },
    });
  }

  public async findOneWithCategoriesWithEntityManager(
    entityManager: EntityManager,
    announcementId: number,
  ): Promise<AnnouncementEntity> {
    const announcementRepository =
      entityManager.getRepository(AnnouncementEntity);

    return announcementRepository.findOne({
      where: { id: announcementId },
      relations: { categories: true },
      order: { categories: { orderingNumber: 'ASC' } },
    });
  }
}
