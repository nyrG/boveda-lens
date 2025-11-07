// backend/src/database/seeds/seed.ts

import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Patient } from '../../modules/domains/patients/entities/patient.entity';
import { PatientCategory } from '../../modules/domains/patients/entities/patient-category.entity';
import { Record } from '../../modules/shared/records/entities/record.entity';
import { Sponsor } from '../../modules/domains/patients/entities/sponsor.entity';
import { Consultation } from '../../modules/domains/patients/entities/consultation.entity';
import { RadiologyReport } from '../../modules/domains/patients/entities/radiology-report.entity';
import { LabReport } from '../../modules/domains/patients/entities/lab-report.entity';
import { RecordType } from '../../modules/shared/records/entities/record-type.entity';
import { AppDataSource } from '../data-source';
import {
  PatientAddress,
  AddressType,
} from '../../modules/domains/patients/entities/patient-address.entity';
import { allCategories } from '../../modules/domains/extraction/extraction.constants'; // This is likely just an array of strings now

const NUM_PATIENTS_TO_SEED = 50;

/**
 * Creates a single, fully-populated random patient object.
 */
const createRandomPatient = (
  category: PatientCategory,
  diagnoses: string[],
  complaints: string[],
  findings: string[],
  medications: string[][],
  allergies: string[][],
  recordType: RecordType,
): Patient => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const sex = faker.helpers.arrayElement(['M', 'F'] as const);
  const patient = new Patient();

  // Populate direct properties of the Patient entity
  patient.first_name = firstName;
  patient.middle_initial = faker.string.alpha(1).toUpperCase();
  patient.last_name = lastName;
  patient.patient_record_number = faker.string.numeric(6);
  patient.afpsn = faker.string.numeric(7);
  patient.date_of_birth = faker.date
    .birthdate({ min: 18, max: 65, mode: 'age' })
    .toISOString()
    .split('T')[0];
  patient.sex = sex;
  patient.branch_of_service = faker.helpers.arrayElement(['PA', 'PN', 'PAF']);
  patient.rank = faker.helpers.arrayElement(['PVT', 'CPL', 'SGT', 'LTO']);
  patient.unit_assignment = faker.company.name();

  // Assign the pre-fetched category
  patient.category = category;
  patient.category_id = category.id;

  // Create and assign the new Record entity
  const record = new Record();
  record.name = `${firstName} ${lastName}`;
  record.record_type = recordType;
  patient.record = record;

  // Create and assign the new Sponsor entity
  const sponsor = new Sponsor();
  sponsor.first_name = faker.person.firstName();
  sponsor.last_name = lastName;
  sponsor.sex = faker.helpers.arrayElement(['M', 'F'] as const);
  sponsor.afpsn = faker.string.numeric(7);
  sponsor.branch_of_service = 'N/A';
  sponsor.unit_assignment = 'N/A';
  patient.sponsors = [sponsor];

  // Create and assign new Consultation entities
  patient.consultations = Array.from({ length: 3 }, () => {
    const consultation = new Consultation();
    consultation.consultation_date = faker.date.recent({ days: 365 }).toISOString().split('T')[0];
    consultation.chief_complaint = faker.lorem.sentence();
    consultation.diagnosis = faker.lorem.words(3);
    consultation.notes = faker.lorem.paragraphs(2, '\n\n');
    consultation.attending_physician = `Dr. ${faker.person.lastName()}`;
    consultation.treatment_plan = `Prescribed ${faker.commerce.productName()}`;
    consultation.height_cm = faker.number.int({ min: 150, max: 190 });
    consultation.weight_kg = faker.number.int({ min: 50, max: 100 });
    consultation.temperature_c = parseFloat(
      faker.number.float({ min: 36.5, max: 37.5 }).toFixed(1),
    );
    return consultation;
  });

  // Create and assign new RadiologyReport entities
  patient.radiology_reports = [
    Object.assign(new RadiologyReport(), {
      examination: 'Chest X-Ray',
      date_performed: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      findings: `Lungs are clear. No signs of pneumonia or other acute disease.\nCardiomediastinal silhouette is within normal limits.`,
      impression: `No acute cardiopulmonary process.`,
      radiologist: `Dr. ${faker.person.lastName()}`,
    }),
    Object.assign(new RadiologyReport(), {
      examination: 'Abdominal Ultrasound',
      date_performed: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
      findings: `The liver, gallbladder, and spleen appear normal in size and echotexture.\nNo evidence of gallstones or biliary ductal dilatation.\nThe pancreas is unremarkable.`,
      impression: `Normal ultrasound of the abdomen.`,
      radiologist: `Dr. ${faker.person.lastName()}`,
    }),
  ];

  // Create and assign new LabReport entities
  patient.lab_reports = [
    Object.assign(new LabReport(), {
      test_type: 'Complete Blood Count (CBC)',
      date_performed: faker.date.recent({ days: 180 }).toISOString().split('T')[0],
      results: [
        {
          test_name: 'White Blood Cell (WBC)',
          value: faker.number.float({ min: 4.5, max: 11.0, fractionDigits: 1 }).toString(),
          reference_range: '4.5-11.0',
          unit: 'x10^9/L',
        },
        {
          test_name: 'Red Blood Cell (RBC)',
          value: faker.number.float({ min: 4.2, max: 5.9, fractionDigits: 2 }).toString(),
          reference_range: '4.2-5.9',
          unit: 'x10^12/L',
        },
        {
          test_name: 'Hemoglobin (Hgb)',
          value: faker.number.int({ min: 120, max: 175 }).toString(),
          reference_range: '120-175',
          unit: 'g/L',
        },
      ],
    }),
  ];
  // Create and assign the summary object
  patient.summary = {
    diagnoses: [faker.helpers.arrayElement(diagnoses)],
    primary_complaint: faker.helpers.arrayElement(complaints),
    // Use paragraphs for more realistic, formatted long-form text
    key_findings: `${faker.helpers.arrayElement(
      findings,
    )}\n\nAdditional observations confirm the initial assessment. Patient responded well to initial treatment during the observation period. Follow-up is recommended in 2 weeks.`,
    medications_prescribed: faker.helpers.arrayElement(medications),
    allergies: faker.helpers.arrayElement(allergies),
  };
  // Create and assign new PatientAddress entities
  patient.addresses = Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const address = new PatientAddress();
    address.houseNoStreet = faker.location.streetAddress();
    address.barangay = faker.location.county();
    address.cityMunicipality = faker.location.city();
    address.province = faker.location.state();
    address.zipCode = faker.location.zipCode();
    address.country = faker.location.country();
    address.addressType = faker.helpers.arrayElement(Object.values(AddressType));
    return address;
  });

  return patient;
};

const seedPatients = async (dataSource: DataSource) => {
  const patientRepository = dataSource.getRepository(Patient);
  const categoryRepository = dataSource.getRepository(PatientCategory);
  const recordTypeRepository = dataSource.getRepository(RecordType);

  console.log('🌱 Seeding patient categories...');
  const categoryEntities = allCategories.map((name) => {
    const category = new PatientCategory();
    category.name = name;
    category.description = `Patients belonging to the ${name} category.`;
    return category;
  });
  await categoryRepository.save(categoryEntities);
  const savedCategories = await categoryRepository.find();
  console.log('✅ Categories seeded!');

  console.log('🌱 Seeding record types...');
  let recordType = await recordTypeRepository.findOneBy({ name: 'Patient Medical Record' });
  if (!recordType) {
    recordType = recordTypeRepository.create({
      name: 'Patient Medical Record',
      description: 'A record for a patient in the medical system.',
    });
    await recordTypeRepository.save(recordType);
  }
  console.log('✅ Record types seeded!');

  const diagnoses = [
    'Acute Bronchitis',
    'Type 2 Diabetes',
    'Hypertension',
    'Gastroenteritis',
    'Migraine',
    'Allergic Rhinitis',
  ];
  const complaints = [
    'Persistent cough and chest congestion.',
    'Increased thirst and frequent urination.',
    'High blood pressure readings at home.',
    'Nausea, vomiting, and diarrhea.',
    'Severe recurring headaches.',
    'Nasal congestion and sneezing.',
  ];
  const findings = [
    'Lungs clear, no signs of pneumonia.',
    'Elevated HbA1c levels.',
    'BP consistently above 140/90 mmHg.',
    'Dehydration and abdominal tenderness.',
    'Normal neurological exam.',
    'Inflamed nasal passages.',
  ];
  const medications = [
    ['Albuterol Inhaler', 'Guaifenesin'],
    ['Metformin', 'Glipizide'],
    ['Lisinopril', 'Amlodipine'],
    ['Ondansetron'],
    ['Sumatriptan'],
    ['Loratadine', 'Fluticasone Spray'],
  ];
  const allergies = [
    ['None'],
    ['Penicillin'],
    ['Sulfa drugs'],
    ['None'],
    ['Aspirin'],
    ['Pollen', 'Dust Mites'],
  ];

  console.log(`🌱 Seeding ${NUM_PATIENTS_TO_SEED} dummy patient records...`);

  const patients: Patient[] = [];
  for (let i = 0; i < NUM_PATIENTS_TO_SEED; i++) {
    const randomCategory = faker.helpers.arrayElement(savedCategories);
    patients.push(
      createRandomPatient(
        randomCategory,
        diagnoses,
        complaints,
        findings,
        medications,
        allergies,
        recordType,
      ),
    );
  }

  // Save all patient records. Due to `cascade: ['insert']` on the Patient entity's relations,
  // this single save operation will also insert all related records, sponsors, consultations, reports, and addresses.
  await patientRepository.save(patients, { chunk: 10 });
  console.log('✅ Patients and all related entities seeded!');

  console.log('✅ Seeding complete!');
};

// Connect to the database and run the seeder
AppDataSource.initialize()
  .then(async () => {
    await seedPatients(AppDataSource);
    await AppDataSource.destroy();
  })
  .catch((error) => console.error('Error seeding database:', error));
