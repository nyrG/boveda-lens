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

  console.log(`🗑️  Preparing to DROP the following tables: ${tableNames}`);

  // Temporarily disable foreign key checks to allow dropping tables in any order.
  await dataSource.query(`SET session_replication_role = 'replica';`);
  await dataSource.query(`DROP TABLE IF EXISTS ${tableNames} CASCADE;`);
  // Re-enable foreign key checks.
  await dataSource.query(`SET session_replication_role = 'origin';`);

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
