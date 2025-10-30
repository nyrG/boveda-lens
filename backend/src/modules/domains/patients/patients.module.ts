import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Record } from 'src/modules/shared/records/entities/record.entity';
import { RecordType } from 'src/modules/shared/records/entities/record-type.entity';
import { Consultation } from './entities/consultation.entity';
import { LabReport } from './entities/lab-report.entity';
import { RadiologyReport } from './entities/radiology-report.entity';
import { Sponsor } from './entities/sponsor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      Record,
      RecordType,
      Consultation,
      LabReport,
      RadiologyReport,
      Sponsor,
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
