// backend/src/database/clear-db.ts

import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

/**
 * Clears all data from all tables managed by TypeORM in the connected database.
 * This script is intended for development and testing purposes.
 * It uses a TRUNCATE command which is fast but destructive.
 * @param dataSource The TypeORM DataSource instance.
 */
const clearDatabase = async (dataSource: DataSource): Promise<void> => {
  console.log('🗑️  Dropping database schema...');
  // The `true` argument in synchronize will drop the schema before creating it.
  // This is the safest and most idiomatic way to clear the database for development.
  await dataSource.synchronize(true);
  console.log('✅  Database has been successfully cleared and synchronized.');
};

void (async () => {
  try {
    await AppDataSource.initialize();
    console.log('✔️  Database connection established.');
    await clearDatabase(AppDataSource);
  } catch (error) {
    console.error('❌  Error clearing the database:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('👋  Database connection closed.');
  }
})();
