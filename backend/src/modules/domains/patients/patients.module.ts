import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { Record } from '../../shared/records/entities/record.entity';
import { RecordType } from '../../shared/records/entities/record-type.entity';
import { Consultation } from './entities/consultation.entity';
import { LabReport } from './entities/lab-report.entity';
import { RadiologyReport } from './entities/radiology-report.entity';
import { Sponsor } from './entities/sponsor.entity';
import { PatientAddress } from './entities/patient-address.entity';
import { PatientCategory } from './entities/patient-category.entity';
import { PatientView } from './views/patient.view';

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
      PatientAddress,
      PatientCategory, // This line makes the repository available for injection
      PatientView,
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
