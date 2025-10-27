import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

/**
 * Represents a single test result within a lab report.
 */
export interface TestResult {
  test_name?: string;
  value?: string | number | null;
  reference_range?: string;
  unit?: string;
}

@Entity('lab_reports')
export class LabReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.lab_reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column()
  patient_id: number;

  @Column({ nullable: true })
  test_type: string;

  @Column({ type: 'date', nullable: true })
  date_performed: string;

  @Column('jsonb', { nullable: true })
  results: TestResult[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
