import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { formatPatientDto } from './utils/patient-formatting.utils';
import { PatientInfo, CategoryStat, DiagnosisStat, AvgAgeResult } from './types/patient.types';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const info = createPatientDto.patient_info as PatientInfo;

    if (!info || !info.full_name || !info.full_name.first_name || !info.full_name.last_name) {
      throw new BadRequestException(
        'Patient data is incomplete. A first and last name are required to save a new record.',
      );
    }

    formatPatientDto(createPatientDto);

    const patient = this.patientsRepository.create(createPatientDto);
    patient.name = [info.full_name.first_name, info.full_name.last_name].filter(Boolean).join(' ');

    return this.patientsRepository.save(patient);
  }

  async findAll(
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

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
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
      : 'N/A';

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
  }
}
