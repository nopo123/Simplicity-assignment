import { INestApplication } from '@nestjs/common';
import * as http from 'http';
import { DataSource } from 'typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';

export type SetupTestingData = {
  readonly app: INestApplication;
  readonly server: http.Server;
  readonly dataSource: DataSource;
  readonly categories: CategoryEntity[];
};
