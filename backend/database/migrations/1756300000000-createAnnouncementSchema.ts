import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnnouncementSchema1756300000000
  implements MigrationInterface
{
  name = 'CreateAnnouncementSchema1756300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL NOT NULL,
        "code" character varying(64) NOT NULL,
        "labels" jsonb NOT NULL,
        "orderingNumber" integer NOT NULL,
        "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_category" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_category_code" UNIQUE ("code")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "announcement" (
        "id" SERIAL NOT NULL,
        "title" character varying(255) NOT NULL,
        "body" text NOT NULL,
        "publicationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
        "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_announcement" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_announcement_updated" ON "announcement" ("updated")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcement_publication_date" ON "announcement" ("publicationDate")`,
    );

    await queryRunner.query(`
      CREATE TABLE "announcement_category" (
        "announcementId" integer NOT NULL,
        "categoryId" integer NOT NULL,
        CONSTRAINT "PK_announcement_category" PRIMARY KEY ("announcementId", "categoryId"),
        CONSTRAINT "FK_announcement_category_announcement" FOREIGN KEY ("announcementId")
          REFERENCES "announcement"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_announcement_category_category" FOREIGN KEY ("categoryId")
          REFERENCES "category"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_announcement_category_categoryId" ON "announcement_category" ("categoryId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_announcement_category_categoryId"`,
    );
    await queryRunner.query(`DROP TABLE "announcement_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_announcement_publication_date"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_announcement_updated"`);
    await queryRunner.query(`DROP TABLE "announcement"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
