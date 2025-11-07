import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Summary } from '../types/patient.types';

/**
 * This ViewEntity provides a real-time calculated age for patients.
 * The 'age' is calculated dynamically using the current date and the patient's date of birth,
 * ensuring it is always up-to-date without requiring updates to the base patient table.
 */
@ViewEntity({
  name: 'patient_view', // Explicitly name the database view
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('p.id', 'id')
      .addSelect('p.first_name', 'first_name')
      .addSelect('p.middle_initial', 'middle_initial')
      .addSelect('p.last_name', 'last_name')
      .addSelect('p.patient_record_number', 'patient_record_number')
      .addSelect('p.afpsn', 'afpsn')
      .addSelect('p.date_of_birth', 'date_of_birth')
      // Real-time age calculation using AGE(NOW(), date_of_birth)
      .addSelect(`EXTRACT(YEAR FROM AGE(NOW(), p.date_of_birth))`, 'current_age') // Real-time age
      .addSelect('p.age', 'extracted_age') // The age extracted from the record
      .addSelect('p.sex', 'sex')
      .addSelect('p.branch_of_service', 'branch_of_service')
      .addSelect('p.rank', 'rank')
      .addSelect('p.unit_assignment', 'unit_assignment')
      .addSelect('p.category_id', 'category_id')
      .addSelect('p.summary', 'summary')
      .addSelect('p.created_at', 'created_at')
      .addSelect('p.updated_at', 'updated_at')
      .addSelect('p.deleted_at', 'deleted_at')
      .from(Patient, 'p')
      .where('p.deleted_at IS NULL'), // Only include non-soft-deleted patients
})
export class PatientView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  first_name: string;

  @ViewColumn()
  middle_initial: string;

  @ViewColumn()
  last_name: string;

  @ViewColumn()
  patient_record_number: string;

  @ViewColumn()
  afpsn: string;

  @ViewColumn()
  date_of_birth: string;

  @ViewColumn()
  current_age: number; // This column will hold the real-time calculated age

  @ViewColumn()
  extracted_age: number; // This column will hold the age extracted from the record

  @ViewColumn()
  sex: 'M' | 'F';

  @ViewColumn()
  branch_of_service: string;

  @ViewColumn()
  rank: string;

  @ViewColumn()
  unit_assignment: string;

  @ViewColumn()
  category_id: number;

  @ViewColumn()
  summary: Summary | null;

  @ViewColumn()
  created_at: Date;

  @ViewColumn()
  updated_at: Date;

  @ViewColumn()
  deleted_at: Date;
}
