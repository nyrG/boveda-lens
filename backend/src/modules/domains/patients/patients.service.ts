import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, DataSource } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/patient/create-patient.dto';
import { UpdatePatientDto } from './dto/patient/update-patient.dto';
import { formatPatientDto } from './utils/patient-formatting.utils';
import { Record } from '../../shared/records/entities/record.entity';
import { RecordType } from '../../shared/records/entities/record-type.entity';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/consultation/create-consultation.dto';
import { LabReport } from './entities/lab-report.entity';
import { CreateLabReportDto } from './dto/lab-report/create-lab-report.dto';
import { RadiologyReport } from './entities/radiology-report.entity';
import { CreateRadiologyReportDto } from './dto/radiology-report/create-radiology-report.dto';
import { Sponsor } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/sponsor/create-sponsor.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(RecordType)
    private recordTypeRepository: Repository<RecordType>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(LabReport)
    private labReportRepository: Repository<LabReport>,
    @InjectRepository(RadiologyReport)
    private radiologyReportRepository: Repository<RadiologyReport>,
    @InjectRepository(Sponsor)
    private sponsorRepository: Repository<Sponsor>,
    //Data Source for transactions
    private dataSource: DataSource,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    if (!createPatientDto.first_name || !createPatientDto.last_name) {
      throw new BadRequestException(
        'Patient data is incomplete. A first and last name are required to save a new record.',
      );
    }

    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // Step 1: Find or create the RecordType
      const recordTypeName = 'Patient Medical Record';
      let recordType = await transactionalEntityManager.findOne(RecordType, {
        where: { name: recordTypeName },
      });
      this.logger.debug(`1. Found recordType: ${JSON.stringify(recordType)}`);

      if (!recordType) {
        this.logger.debug('--> RecordType not found, creating a new one.');
        recordType = transactionalEntityManager.create(RecordType, {
          name: recordTypeName,
          description: 'A record for a patient in the medical system.',
        });
        recordType = await transactionalEntityManager.save(recordType);
        this.logger.debug(`--> Saved new recordType: ${JSON.stringify(recordType)}`);
      }

      // Step 2: Build the full entity graph
      const fullName = [
        createPatientDto.first_name,
        createPatientDto.middle_initial,
        createPatientDto.last_name,
      ]
        .filter(Boolean)
        .join(' ');

      // Step 2: Create the patient entity with its nested record.
      // TypeORM will handle the insertion order because of `cascade: true`.
      const patientEntity = transactionalEntityManager.create(Patient, {
        ...createPatientDto,
        record: {
          name: fullName,
          record_type: recordType,
          record_type_id: recordType.id,
        },
      });
      this.logger.debug(`2. Patient entity to be saved: ${JSON.stringify(patientEntity)}`);

      const savedPatient = await transactionalEntityManager.save(patientEntity);

      // Step 4: Iterate through related patient entities
      if (createPatientDto.consultations && createPatientDto.consultations.length > 0) {
        const consultationEntities = createPatientDto.consultations.map(
          (consultationDto: CreateConsultationDto) => {
            return transactionalEntityManager.create(Consultation, {
              ...consultationDto,
              patient: savedPatient,
            });
          },
        );
        await transactionalEntityManager.save(consultationEntities);
        this.logger.debug('--> Saved consultations.');
      }

      if (createPatientDto.lab_reports && createPatientDto.lab_reports.length > 0) {
        const labReportEntities = createPatientDto.lab_reports.map(
          (labReportDto: CreateLabReportDto) => {
            return transactionalEntityManager.create(LabReport, {
              ...labReportDto,
              patient: savedPatient,
            });
          },
        );
        await transactionalEntityManager.save(labReportEntities);
        this.logger.debug('--> Saved lab reports.');
      }

      if (createPatientDto.radiology_reports && createPatientDto.radiology_reports.length > 0) {
        const radiologyReportEntities = createPatientDto.radiology_reports.map(
          (radiologyReportDto: CreateRadiologyReportDto) => {
            return transactionalEntityManager.create(RadiologyReport, {
              ...radiologyReportDto,
              patient: savedPatient,
            });
          },
        );
        await transactionalEntityManager.save(radiologyReportEntities);
        this.logger.debug('--> Saved radiology reports.');
      }

      if (createPatientDto.sponsors && createPatientDto.sponsors.length > 0) {
        const sponsorEntities = createPatientDto.sponsors.map((sponsorDto: CreateSponsorDto) => {
          return transactionalEntityManager.create(Sponsor, {
            ...sponsorDto,
            patient: savedPatient,
          });
        });
        await transactionalEntityManager.save(sponsorEntities);
        this.logger.debug('--> Saved sponsors.');
      }

      // Return the patient, which now has its ID and relations populated
      return savedPatient;
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: [
        'record',
        'consultations',
        'lab_reports',
        'radiology_reports',
        'sponsors',
        'category',
      ],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  /* async findAll(
    page: number,
    limit: number,
    search?: string,
    sortBy: string = 'updated_at',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    category?: string,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.patientsRepository.createQueryBuilder('patient');

    if (search) {
      queryBuilder.where('patient.name ILIKE :search', { search: `%${search}%` });
    }

    if (category) {
      // This query specifically targets the 'category' key within the 'patient_info' JSONB column
      queryBuilder.andWhere("patient.patient_info ->> 'category' = :category", { category });
    }

    // Map API sort fields to database columns/expressions to prevent SQL injection
    // and provide a clear, maintainable mapping.
    const sortMap: { [key: string]: string } = {
      name: 'patient.name',
      patient_record_number: `patient.patient_info ->> 'patient_record_number'`,
      final_diagnosis: `patient.summary ->> 'final_diagnosis'`,
      category: `patient.patient_info ->> 'category'`,
      created_at: 'patient.created_at',
      updated_at: 'patient.updated_at',
    };

    const sortColumn = sortMap[sortBy];

    if (sortColumn) {
      // If a valid sort column is found in the map, apply it.
      // The JSONB access syntax `->>` is included in the map value.
      queryBuilder.orderBy(sortColumn, sortOrder);
    } else {
      // Default to a safe sort order if the provided sortBy is not in our map.
      queryBuilder.orderBy('patient.name', 'ASC');
    }

    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { data, total };
  }

  async getStats() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Execute all statistics queries in parallel for better performance
    const [totalPatients, recentlyUpdated, categories, topDiagnoses, avgAgeResult]: [
      number,
      number,
      CategoryStat[],
      DiagnosisStat[],
      AvgAgeResult[],
    ] = (await Promise.all([
      this.patientsRepository.count(),
      this.patientsRepository.count({ where: { updated_at: MoreThan(oneDayAgo) } }),
      this.patientsRepository
        .createQueryBuilder('patient')
        .select("patient.patient_info ->> 'category'", 'category')
        .addSelect('COUNT(*)', 'count')
        .groupBy("patient.patient_info ->> 'category'")
        .orderBy('count', 'DESC')
        .getRawMany<CategoryStat>(),
      this.patientsRepository.query(`
          SELECT diagnosis, COUNT(diagnosis) as count
          FROM patients, jsonb_array_elements_text(summary->'final_diagnosis') AS diagnosis
          WHERE jsonb_typeof(summary->'final_diagnosis') = 'array' AND deleted_at IS NULL
          GROUP BY diagnosis
          ORDER BY count DESC
          LIMIT 5;
      `),
      this.patientsRepository.query(
        `SELECT AVG(EXTRACT(YEAR FROM AGE(NOW(), (patient_info->>'date_of_birth')::date))) as "avgAge" FROM patients WHERE deleted_at IS NULL`,
      ),
    ])) as [number, number, CategoryStat[], DiagnosisStat[], AvgAgeResult[]];

    const averageAge = avgAgeResult[0]?.avgAge
      ? parseFloat(avgAgeResult[0].avgAge).toFixed(1)
      : null;

    return { totalPatients, recentlyUpdated, categories, topDiagnoses, averageAge };
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    formatPatientDto(updatePatientDto);

    const info = updatePatientDto.patient_info as PatientInfo;

    const updatedPatient = this.patientsRepository.merge(patient, updatePatientDto);

    // If the name was part of the update, re-generate the top-level `name` field
    if (info?.full_name) {
      updatedPatient.name = [info.full_name.first_name, info.full_name.last_name]
        .filter(Boolean)
        .join(' ');
    }

    return this.patientsRepository.save(updatedPatient);
  }

  async remove(id: number): Promise<void> {
    const result = await this.patientsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async removeMany(ids: number[]): Promise<void> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No record IDs provided for deletion.');
    }
    const result = await this.patientsRepository.softDelete(ids);
    if (result.affected === 0) {
      // This is not necessarily an error, could mean records were already deleted.
    }
  } */
}
