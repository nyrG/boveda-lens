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
  const entities = dataSource.entityMetadatas;
  const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

  if (!tableNames.length) {
    console.log('No tables found to clear.');
    return;
  }

  console.log(`🗑️  Preparing to truncate the following tables: ${tableNames}`);

  // Using `TRUNCATE ... RESTART IDENTITY CASCADE` is a PostgreSQL-specific command.
  // It efficiently deletes all rows, resets auto-incrementing counters, and cascades to dependent tables.
  await dataSource.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);

  console.log('✅  All tables have been successfully cleared.');
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
