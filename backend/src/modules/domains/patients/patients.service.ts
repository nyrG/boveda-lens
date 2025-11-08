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
import { PatientAddress } from './entities/patient-address.entity';
import { Sponsor } from './entities/sponsor.entity';
import { FindAllPatientsDto } from './dto/patient/find-all-patients.dto';
import { CreateSponsorDto } from './dto/sponsor/create-sponsor.dto';
import { PatientAddressDto } from './dto/patient-address/patient-address.dto';
import { PatientCategory } from './entities/patient-category.entity';

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
    @InjectRepository(PatientAddress)
    private patientAddressRepository: Repository<PatientAddress>,
    @InjectRepository(PatientCategory)
    private patientCategoryRepository: Repository<PatientCategory>,
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

      // Step 2: Handle the patient category
      let categoryEntity: PatientCategory | undefined;
      if (createPatientDto.category) {
        const { id, name } = createPatientDto.category;
        if (id) {
          // If an ID is provided, try to find the existing category
          const foundCategory = await transactionalEntityManager.findOneBy(PatientCategory, { id });
          if (foundCategory) {
            categoryEntity = foundCategory;
          }
        } else if (name) {
          // If no ID but a name is provided, find or create the category by name
          const foundCategoryByName = await transactionalEntityManager.findOne(PatientCategory, {
            where: { name },
          });
          if (foundCategoryByName) {
            categoryEntity = foundCategoryByName;
          } else {
            categoryEntity = transactionalEntityManager.create(
              PatientCategory,
              createPatientDto.category,
            );
          }
        }
      }

      // Step 2: Build the full entity graph
      const fullName = [
        createPatientDto.first_name,
        createPatientDto.middle_initial,
        createPatientDto.last_name,
      ]
        .filter(Boolean)
        .join(' ');

      // Step 3: Create the patient entity with its nested relations.
      // TypeORM will handle the insertion order for all cascaded relations.
      const patientEntity = transactionalEntityManager.create(Patient, {
        ...createPatientDto,
        category: categoryEntity, // Assign the resolved category entity
        record: {
          name: fullName,
          record_type: recordType,
          record_type_id: recordType.id,
        },
        // Addresses are created directly on the patient due to cascade settings
        addresses: createPatientDto.addresses || [],
      });

      // If age is not provided, calculate it from the date of birth.
      // This sets the age at the time of creation.
      if (
        (patientEntity.age === undefined || patientEntity.age === null) &&
        patientEntity.date_of_birth
      ) {
        const birthDate = new Date(patientEntity.date_of_birth);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        patientEntity.age = calculatedAge;
      }

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
    // Fetch the patient and all its direct relations, including addresses.
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: [
        'record',
        'addresses', // Now a direct relation, can be loaded here.
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
        relations: ['record', 'addresses'], // Load existing addresses
      });

      if (!patient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Merge the DTO into the patient entity. This applies the partial update.
      transactionalEntityManager.merge(Patient, patient, updatePatientDto);

      // If age is not provided in the update and is currently null,
      // calculate it from the date of birth.
      if ((patient.age === undefined || patient.age === null) && patient.date_of_birth) {
        const birthDate = new Date(patient.date_of_birth);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        patient.age = calculatedAge;
      }

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

        // 1. Identify and remove addresses that are no longer in the DTO
        const addressesToDelete = existingAddresses.filter(
          (existingAddr) => !addressesToKeepIds.has(existingAddr.id),
        );
        if (addressesToDelete.length > 0) {
          await transactionalEntityManager.remove(PatientAddress, addressesToDelete);
        }

        // 2. Update existing addresses or create new ones
        const updatedOrNewAddresses: PatientAddress[] = [];
        for (const incomingAddrDto of incomingAddresses) {
          if (incomingAddrDto.id) {
            // Update existing address
            const existingAddr = existingAddresses.find((addr) => addr.id === incomingAddrDto.id);
            if (existingAddr) {
              transactionalEntityManager.merge(PatientAddress, existingAddr, incomingAddrDto);
              updatedOrNewAddresses.push(existingAddr);
            }
            // Note: We are ignoring cases where an ID is provided but doesn't exist.
            // This could be an error, but for now, we just skip it.
          } else {
            // Create new address
            const newAddress = transactionalEntityManager.create(PatientAddress, {
              ...incomingAddrDto,
              patient: patient, // Link to the patient
            });
            updatedOrNewAddresses.push(newAddress);
          }
        }

        // 3. Assign the final list of addresses to the patient entity
        patient.addresses = updatedOrNewAddresses;
      }
      // --- End Handle Addresses ---

      // --- Handle Category ---
      // The DTO can provide a category object, null to remove it, or undefined to leave it unchanged.
      if (updatePatientDto.category !== undefined) {
        if (updatePatientDto.category === null) {
          // If null is explicitly passed, disassociate the category.
          patient.category = null;
        } else if (updatePatientDto.category) {
          // If a category object is provided, find or create it.
          const { id, name } = updatePatientDto.category;
          let categoryEntity: PatientCategory | null = null;

          if (id) {
            const foundCategory = await transactionalEntityManager.findOneBy(PatientCategory, {
              id,
            });
            if (foundCategory) {
              categoryEntity = foundCategory;
            }
            // If an ID is provided but not found, we could throw an error or ignore.
            // For now, we'll just not update the category if the ID is invalid.
          } else if (name) {
            const foundCategoryByName = await transactionalEntityManager.findOne(PatientCategory, {
              where: { name },
            });
            if (foundCategoryByName) {
              categoryEntity = foundCategoryByName;
            } else {
              // Create a new category if it doesn't exist by name.
              categoryEntity = transactionalEntityManager.create(
                PatientCategory,
                updatePatientDto.category,
              );
            }
          }

          if (categoryEntity) {
            patient.category = categoryEntity;
          }
        }
      }

      // Save the patient. TypeORM will handle inserts, updates, and removals
      // for the addresses collection due to the cascade settings.
      patient = await transactionalEntityManager.save(Patient, patient);

      // Re-fetch the patient with updated addresses to ensure the returned object is complete and not null
      const updatedPatient = await transactionalEntityManager.findOne(Patient, {
        where: { id: patient.id },
        relations: ['record', 'addresses', 'category'],
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
      avgAge: number | null; // AVG returns a number when used with query builder
    }

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalPatients, recentlyUpdated, categories, topDiagnoses, avgAgeResult]: [
      number,
      number,
      CategoryStat[],
      DiagnosisStat[],
      AvgAgeResult | undefined,
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
      // Use query builder to safely calculate the average of the 'age' column.
      // The AVG function in SQL automatically ignores NULL values.
      this.patientsRepository
        .createQueryBuilder('patient')
        .select('AVG(patient.age)', 'avgAge')
        .getRawOne<AvgAgeResult>(),
    ]);

    const averageAge = avgAgeResult?.avgAge ? Number(avgAgeResult.avgAge).toFixed(1) : null;

    return { totalPatients, recentlyUpdated, categories, topDiagnoses, averageAge };
  }
}
