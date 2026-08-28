import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const entitiesPath = [`${__dirname}/../src/**/*.entity{.ts,.js}`];

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: entitiesPath,
  synchronize: false,
  logging: true,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: process.env.DATABASE_MIGRATION_NAME,
  migrationsTransactionMode: 'each',
});

export default datasource;
