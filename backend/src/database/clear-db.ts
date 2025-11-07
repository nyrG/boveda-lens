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
  // Separate entities into tables and views
  const entities = dataSource.entityMetadatas;
  const tableNames: string[] = [];
  const viewNames: string[] = [];

  entities.forEach((entity) => {
    if (entity.tableType === 'view') {
      viewNames.push(`"${entity.tableName}"`);
    } else {
      tableNames.push(`"${entity.tableName}"`);
    }
  });

  if (tableNames.length === 0 && viewNames.length === 0) {
    console.log('No tables or views found to clear.');
    return;
  }

  // Temporarily disable foreign key checks to allow dropping in any order.
  await dataSource.query(`SET session_replication_role = 'replica';`);

  if (viewNames.length > 0) {
    console.log(`🗑️  Preparing to DROP the following views: ${viewNames.join(', ')}`);
    await dataSource.query(`DROP VIEW IF EXISTS ${viewNames.join(', ')} CASCADE;`);
  }
  if (tableNames.length > 0) {
    console.log(`🗑️  Preparing to DROP the following tables: ${tableNames.join(', ')}`);
    await dataSource.query(`DROP TABLE IF EXISTS ${tableNames.join(', ')} CASCADE;`);
  }

  // Re-enable foreign key checks.
  await dataSource.query(`SET session_replication_role = 'origin';`);

  console.log('✅  All tables and views have been successfully cleared.');
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
