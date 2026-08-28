import { join } from 'path';
import { registerAs } from '@nestjs/config';

const entitiesPath = [join(__dirname, '..', '**', '*.entity.{ts,js}')];

export default registerAs('database', () => ({
  logging:
    process.env.APP_ENV === 'dev' &&
    process.env.DATABASE_ENABLE_LOGGING === 'true'
      ? ['schema', 'error', 'warn', 'info', 'log']
      : undefined,
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: false,
  synchronize: false,
  entities: entitiesPath,
  migrations: [`${__dirname}/../../database/migrations/*{.ts,.js}`],
  migrationsTableName: process.env.DATABASE_MIGRATION_NAME,
  migrationsTransactionMode: 'each',
  extra: {
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    max: 20,
    connectionTimeoutMillis: 5000,
    statement_timeout: 30000,
    query_timeout: 35000,
  },
}));
