import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/data-source';
import { PatientsModule } from './modules/domains/patients/patients.module';
import { ExtractionModule } from './modules/domains/extraction/extraction.module';
import { UsersModule } from './modules/domains/users/users.module';
import { AuthModule } from './modules/domains/auth/auth.module';
import { RecordsModule } from './modules/shared/records/records.module';
import { AddressesModule } from './modules/shared/addresses/addresses.module';

@Module({
  imports: [
    // This will load the .env file from the root directory
    ConfigModule.forRoot({
      isGlobal: true, // Make the config service available globally
      envFilePath: join(__dirname, '..', '.env'),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PatientsModule,
    ExtractionModule,
    UsersModule,
    AuthModule,
    RecordsModule,
    AddressesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
