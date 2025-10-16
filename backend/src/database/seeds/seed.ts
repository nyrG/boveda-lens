// backend/src/database/seeds/seed.ts

import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Patient } from '../../patients/entities/patient.entity';
import { AppDataSource } from '../data-source';

const NUM_PATIENTS_TO_SEED = 20;

/**
 * Creates a single, fully-populated random patient object.
 * @param diagnoses - Array of possible diagnoses.
 * @param complaints - Array of possible complaints.
 * @param findings - Array of possible findings.
 * @param medications - Array of possible medications.
 * @param allergies - Array of possible allergies.
 * @returns A new Patient instance.
 */
const createRandomPatient = (
  diagnoses: string[],
  complaints: string[],
  findings: string[],
  medications: string[][],
  allergies: string[][],
): Patient => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const patient = new Patient();

  patient.name = `${firstName} ${lastName}`;

  patient.patient_info = {
    full_name: {
      first_name: firstName,
      middle_initial: faker.string.alpha(1).toUpperCase(),
      last_name: lastName,
    },
    date_of_birth: faker.date
      .birthdate({ min: 18, max: 65, mode: 'age' })
      .toISOString()
      .split('T')[0],
    patient_record_number: faker.string.numeric(6),
    category: 'ACTIVE MILITARY',
    address: {
      house_no_street: faker.location.streetAddress(),
      barangay: 'Villamor Air Base',
      city_municipality: faker.location.city(),
      province: faker.location.state(),
      zip_code: faker.location.zipCode(),
    },
    rank: faker.helpers.arrayElement(['PVT', 'CPL', 'SGT', 'LTO']),
    afpsn: faker.string.numeric(7),
    branch_of_service: faker.helpers.arrayElement(['PA', 'PN', 'PAF']),
    unit_assignment: faker.company.name(),
  };

  patient.sponsor_info = {
    sponsor_name: {
      first_name: faker.person.firstName(),
      last_name: lastName,
    },
    afpsn: faker.string.numeric(7),
    branch_of_service: 'N/A',
    unit_assignment: 'N/A',
  };

  patient.medical_encounters = {
    consultations: [
      {
        consultation_date: faker.date.recent({ days: 365 }).toISOString().split('T')[0],
        chief_complaint: faker.lorem.sentence(),
        diagnosis: faker.lorem.words(3),
        attending_physician: `Dr. ${faker.person.lastName()}`,
        treatment_plan: `Prescribed ${faker.commerce.productName()}`,
      },
    ],
  };

  patient.summary = {
    final_diagnosis: [faker.helpers.arrayElement(diagnoses)],
    primary_complaint: faker.helpers.arrayElement(complaints),
    key_findings: faker.helpers.arrayElement(findings),
    medications_taken: faker.helpers.arrayElement(medications),
    allergies: faker.helpers.arrayElement(allergies),
  };

  return patient;
};

const seedPatients = async (dataSource: DataSource) => {
  const patientRepository = dataSource.getRepository(Patient);

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
    patients.push(createRandomPatient(diagnoses, complaints, findings, medications, allergies));
  }

  // Save all patient records in a single, batched operation for performance.
  await patientRepository.save(patients);

  console.log('✅ Seeding complete!');
};

// Connect to the database and run the seeder
AppDataSource.initialize()
  .then(async () => {
    await seedPatients(AppDataSource);
    await AppDataSource.destroy();
  })
  .catch((error) => console.error('Error seeding database:', error));
