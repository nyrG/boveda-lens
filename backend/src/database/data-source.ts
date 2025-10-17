import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file in the root of the project
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

const baseOptions: Omit<PostgresConnectionOptions, 'type'> = {
  // This robust pattern works for both development (ts-node) and production (node dist/main.js)
  // It points to .ts files in dev and .js files in prod automatically.
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],

  // It's good practice to also make migrations path dynamic
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],

  /**
   * Use synchronize: false in production.
   * Schema changes should be handled via migrations.
   */
  synchronize: !isProduction,
};

const productionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Use SSL in production, as required by most cloud database providers
  ssl: { rejectUnauthorized: false },
  ...baseOptions,
};

const developmentOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: false,
  ...baseOptions,
};

export const dataSourceOptions: DataSourceOptions = isProduction
  ? productionOptions
  : developmentOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
