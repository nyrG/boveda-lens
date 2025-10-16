import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables from .env file in the root of the project
dotenv.config();

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

  // Point to the correct entity files based on the environment
  entities: [isProduction ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],

  migrations: ['dist/database/migrations/*.js'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
