import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUnaccentExtension1756300300000 implements MigrationInterface {
  name = 'AddUnaccentExtension1756300300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "unaccent"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "unaccent"`);
  }
}
