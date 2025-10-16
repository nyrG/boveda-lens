import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file in the root of the project
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Use SSL in production, as required by most cloud database providers
  ssl: isProduction ? { rejectUnauthorized: false } : false,

  /**
   * Use synchronize: false in production.
   * Schema changes should be handled via migrations.
   */
  synchronize: !isProduction,

  // This robust pattern works for both development (ts-node) and production (node dist/main.js)
  // It points to .ts files in dev and .js files in prod automatically.
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],

  // It's good practice to also make migrations path dynamic
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
};

export const AppDataSource = new DataSource(dataSourceOptions);
