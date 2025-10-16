import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './database/data-source';
import { PatientsModule } from './patients/patients.module';
import { ExtractionModule } from './extraction/extraction.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    // This will load the .env file from the root directory
    ConfigModule.forRoot({
      isGlobal: true, // Make the config service available globally
      envFilePath: join(__dirname, '..', '.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PatientsModule,
    ExtractionModule,
    UsersModule,
    AuthModule,
    RecordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
