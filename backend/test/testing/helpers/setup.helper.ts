import { INestApplication, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { SetupTestingData } from '../interfaces/setup.interface';
import { AppModule } from 'src/app.module';
import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  useGlobalFiltersHelper,
  validationPipelinesHelper,
} from 'src/common/helpers/app-create.helper';

export class SetupHelper {
  private app: INestApplication;
  private dataSource: DataSource;

  public async createSetupApp(): Promise<SetupTestingData> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication<NestExpressApplication>();

    validationPipelinesHelper(this.app as NestExpressApplication);
    useGlobalFiltersHelper(this.app as NestExpressApplication);

    this.app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
    });

    await this.app.init();

    this.dataSource = this.app.get(DataSource);
    await this.dataSource.runMigrations();
    await this.truncateAnnouncements();

    const categoryRepository = this.dataSource.getRepository(CategoryEntity);
    const categories = await categoryRepository.find({
      order: { orderingNumber: 'ASC' },
    });

    return {
      app: this.app,
      server: this.app.getHttpServer(),
      dataSource: this.dataSource,
      categories,
    };
  }

  public async listenOnRandomPort(): Promise<number> {
    await this.app.listen(0);
    const address = this.app.getHttpServer().address();

    if (address === null || typeof address === 'string') {
      throw new Error('Test application is not listening on a TCP port');
    }

    return address.port;
  }

  public async truncateAnnouncements(): Promise<void> {
    await this.dataSource.query(
      'TRUNCATE TABLE "announcement_category", "announcement" RESTART IDENTITY CASCADE',
    );
  }

  public async close(): Promise<void> {
    await this.app.close();
  }
}
