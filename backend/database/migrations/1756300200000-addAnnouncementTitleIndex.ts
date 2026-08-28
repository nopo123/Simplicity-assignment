import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnnouncementTitleIndex1756300200000
  implements MigrationInterface
{
  name = 'AddAnnouncementTitleIndex1756300200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_announcement_title" ON "announcement" ("title")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_announcement_title"`);
  }
}
