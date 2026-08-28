process.env.APP_ENV = 'test';

require('dotenv').config();

process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT_TEST || '5433';
process.env.DATABASE_NAME =
  process.env.DATABASE_NAME_TEST || 'announcements_test';
process.env.DATABASE_ENABLE_LOGGING = 'false';
process.env.DATABASE_MIGRATION_NAME =
  process.env.DATABASE_MIGRATION_NAME || 'migration';
