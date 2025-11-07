import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, DataSource } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/patient/create-patient.dto';
import { UpdatePatientDto } from './dto/patient/update-patient.dto';
import { Record } from '../../shared/records/entities/record.entity';
import { RecordType } from '../../shared/records/entities/record-type.entity';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/consultation/create-consultation.dto';
import { LabReport } from './entities/lab-report.entity';
import { CreateLabReportDto } from './dto/lab-report/create-lab-report.dto';
import { RadiologyReport } from './entities/radiology-report.entity';
import { CreateRadiologyReportDto } from './dto/radiology-report/create-radiology-report.dto';
import { Sponsor } from './entities/sponsor.entity';
import { FindAllPatientsDto } from './dto/patient/find-all-patients.dto';
import { Address } from '../../shared/addresses/entities/address.entity';
import { AddressEntityType } from '../../../common/enums/address-entity.enum';
import { CreateSponsorDto } from './dto/sponsor/create-sponsor.dto';
import { PatientAddressDto } from '../../shared/addresses/dto/patient-address.dto';

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
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
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

      if (!recordType) {
        recordType = transactionalEntityManager.create(RecordType, {
          name: recordTypeName,
          description: 'A record for a patient in the medical system.',
        });
        recordType = await transactionalEntityManager.save(recordType);
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

      const savedPatient = await transactionalEntityManager.save(patientEntity);

      // Step 3: Handle Addresses
      if (createPatientDto.addresses && createPatientDto.addresses.length > 0) {
        const addressEntities = createPatientDto.addresses.map((addressDto) => {
          return transactionalEntityManager.create(Address, {
            ...addressDto,
            // Set the polymorphic foreign key and entity type
            entityId: savedPatient.id,
            entityType: AddressEntityType.Patient,
          });
        });
        await transactionalEntityManager.save(addressEntities);
      }

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
      }

      if (createPatientDto.sponsors && createPatientDto.sponsors.length > 0) {
        const sponsorEntities = createPatientDto.sponsors.map((sponsorDto: CreateSponsorDto) => {
          return transactionalEntityManager.create(Sponsor, {
            ...sponsorDto,
            patient: savedPatient,
          });
        });
        await transactionalEntityManager.save(sponsorEntities);
      }

      // Return the patient, which now has its ID and relations populated
      return savedPatient;
    });
  }

  async findOne(id: number): Promise<Patient> {
    // Step 1: Fetch the patient and its standard, non-polymorphic relations.
    // We deliberately exclude 'addresses' here because it's a polymorphic relation
    // that needs special handling to filter by entityType.
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

    // Step 2: Use a separate, targeted query to fetch the polymorphic 'addresses' relation.
    // This correctly filters by both entityId and entityType.
    patient.addresses = await this.addressRepository.findBy({
      entityId: id,
      entityType: AddressEntityType.Patient,
    });

    // Step 3: Return the complete patient object with addresses attached.
    return patient;
  }

  async findAll(queryDto: FindAllPatientsDto): Promise<{ data: Patient[]; total: number }> {
    const { page, limit, search, sortBy, sortOrder, category } = queryDto;

    // Initialize query builder and join the required 'record' relation.
    const queryBuilder = this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.record', 'record');

    // Conditionally filter by category. The condition is in the join to preserve the LEFT JOIN.
    queryBuilder.leftJoinAndSelect(
      'patient.category',
      'category',
      category ? 'category.name = :category' : '1=1',
      { category },
    );

    // Apply search filter for patient's full name if provided.
    if (search && search.trim() !== '') {
      queryBuilder.andWhere("CONCAT(patient.first_name, ' ', patient.last_name) ILIKE :search", {
        search: `%${search}%`,
      });
    }

    // Safely map API sort fields to database columns to prevent SQL injection.
    const sortMap: { [key: string]: string } = {
      name: "CONCAT(patient.first_name, ' ', patient.last_name)",
      patient_record_number: 'patient.patient_record_number',
      diagnoses: "patient.summary ->> 'diagnoses'", // Sorts by a JSONB field
      category: 'category.name',
      created_at: 'record.created_at',
      updated_at: 'record.updated_at',
    };

    const sortColumn = sortMap[sortBy];
    if (sortColumn) {
      queryBuilder.orderBy(sortColumn, sortOrder);
    } else {
      // Default to a safe sort order if the provided sortBy is invalid.
      queryBuilder.orderBy('patient.updated_at', 'DESC');
    }

    // Apply pagination.
    const skip = (page - 1) * limit;

    // Execute query to get paginated data and total count.
    const [data, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return { data, total };
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // Use the transactional entity manager to find the patient
      let patient = await transactionalEntityManager.findOne(Patient, {
        where: { id },
        relations: ['record'],
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Merge the DTO into the patient entity. This applies the partial update.
      transactionalEntityManager.merge(Patient, patient, updatePatientDto);

      // If name fields are being updated, also update the associated record's name.
      if (
        updatePatientDto.first_name ||
        updatePatientDto.last_name ||
        updatePatientDto.middle_initial
      ) {
        const newFullName = [patient.first_name, patient.middle_initial, patient.last_name]
          .filter(Boolean)
          .join(' ');
        patient.record.name = newFullName;
        await transactionalEntityManager.save(Record, patient.record);
      }

      // --- Handle Addresses ---
      if (updatePatientDto.addresses !== undefined) {
        const existingAddresses = patient.addresses || [];
        const incomingAddresses: PatientAddressDto[] = updatePatientDto.addresses || [];

        const addressesToKeepIds = new Set(
          incomingAddresses.filter((addr) => addr.id).map((addr) => addr.id),
        );

        // 1. Delete addresses that are no longer present in the DTO
        const addressesToDelete = existingAddresses.filter(
          (existingAddr) => !addressesToKeepIds.has(existingAddr.id),
        );
        if (addressesToDelete.length > 0) {
          // You might want to softDelete instead of remove, depending on business logic
          await transactionalEntityManager.remove(Address, addressesToDelete);
        }

        const updatedOrNewAddresses: Address[] = [];
        for (const incomingAddrDto of incomingAddresses) {
          if (incomingAddrDto.id) {
            // Update existing address
            const existingAddr = existingAddresses.find((addr) => addr.id === incomingAddrDto.id);
            if (existingAddr) {
              transactionalEntityManager.merge(Address, existingAddr, incomingAddrDto);
              updatedOrNewAddresses.push(existingAddr);
            } else {
              // If an ID is provided but no matching existing address is found, treat as new.
              // A more robust solution might throw an error or verify ownership.
              const newAddress = transactionalEntityManager.create(Address, {
                ...incomingAddrDto,
                entityId: patient.id,
                entityType: AddressEntityType.Patient,
              });
              updatedOrNewAddresses.push(newAddress);
            }
          } else {
            // Create new address
            const newAddress = transactionalEntityManager.create(Address, {
              ...incomingAddrDto,
              entityId: patient.id,
              entityType: AddressEntityType.Patient,
            });
            updatedOrNewAddresses.push(newAddress);
          }
        }
        if (updatedOrNewAddresses.length > 0) {
          await transactionalEntityManager.save(updatedOrNewAddresses);
        }
      }
      // --- End Handle Addresses ---

      // Save the patient (this will also update any merged address entities due to cascade)
      patient = await transactionalEntityManager.save(Patient, patient);

      // Re-fetch the patient with updated addresses to ensure the returned object is complete and not null
      const updatedPatient = await transactionalEntityManager.findOne(Patient, {
        where: { id: patient.id },
        relations: ['record', 'addresses'],
      });
      if (!updatedPatient) {
        throw new NotFoundException(`Patient with ID ${id} could not be refetched after update.`);
      }
      return updatedPatient;
    });
  }

  async remove(id: number): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const patient = await transactionalEntityManager.findOne(Patient, {
        where: { id },
        relations: ['record'],
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Soft delete the associated record first
      if (patient.record) {
        await transactionalEntityManager.softDelete(Record, patient.record.id);
      }

      // Then soft delete the patient
      const result = await transactionalEntityManager.softDelete(Patient, id);

      if (result.affected === 0) {
        // This case should ideally not be reached if the findOne check passes, but it's good for safety.
        throw new NotFoundException(`Patient with ID ${id} could not be deleted.`);
      }
    });
  }

  async removeMany(ids: number[]): Promise<void> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('No record IDs provided for deletion.');
    }
    // The `remove` method handles transactions, so we can call it for each ID.
    // Promise.all ensures all deletions are processed.
    await Promise.all(ids.map((id) => this.remove(id)));
  }

  async getStats(): Promise<any> {
    // Define interfaces for the raw query results for type safety
    interface CategoryStat {
      category: string;
      count: string; // COUNT returns a string in raw queries
    }
    interface DiagnosisStat {
      diagnosis: string;
      count: string;
    }
    interface AvgAgeResult {
      avgAge: string | null;
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalPatients, recentlyUpdated, categories, topDiagnoses, avgAgeResult]: [
      number,
      number,
      CategoryStat[],
      DiagnosisStat[],
      AvgAgeResult[],
    ] = await Promise.all([
      this.patientsRepository.count(),
      this.patientsRepository.count({ where: { updated_at: MoreThan(oneDayAgo) } }),
      this.patientsRepository
        .createQueryBuilder('patient')
        .innerJoin('patient.category', 'category')
        .select('category.name', 'category')
        .addSelect('COUNT(*)', 'count')
        .groupBy('category.name')
        .orderBy('count', 'DESC')
        .getRawMany<CategoryStat>(),
      this.patientsRepository.query<DiagnosisStat[]>(`
          SELECT diagnosis, COUNT(diagnosis) as count FROM patients,
          jsonb_array_elements_text(summary->'diagnoses') AS diagnosis
          WHERE jsonb_typeof(summary->'diagnoses') = 'array' AND deleted_at IS NULL
          GROUP BY diagnosis
          ORDER BY count DESC
          LIMIT 5;
      `),
      this.patientsRepository.query<AvgAgeResult[]>(
        `SELECT AVG(EXTRACT(YEAR FROM AGE(NOW(), date_of_birth))) as "avgAge" FROM patients WHERE deleted_at IS NULL`,
      ),
    ]);

    const averageAge = avgAgeResult[0]?.avgAge
      ? parseFloat(avgAgeResult[0].avgAge).toFixed(1)
      : null;

    return { totalPatients, recentlyUpdated, categories, topDiagnoses, averageAge };
  }
}
