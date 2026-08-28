import { MigrationInterface, QueryRunner } from 'typeorm';
import { SEEDED_CATEGORIES } from '../../src/category/config/seeded-categories.config';

export class SeedCategories1756300100000 implements MigrationInterface {
  name = 'SeedCategories1756300100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const category of SEEDED_CATEGORIES) {
      await queryRunner.query(
        `INSERT INTO "category" ("code", "labels", "orderingNumber")
         VALUES ($1, $2, $3)
         ON CONFLICT ("code") DO NOTHING`,
        [category.code, JSON.stringify(category.labels), category.orderingNumber],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const codes = SEEDED_CATEGORIES.map((category) => category.code);

    await queryRunner.query(
      `DELETE FROM "category" WHERE "code" = ANY($1::text[])`,
      [codes],
    );
  }
}
