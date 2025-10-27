import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { TestResult } from '../types/patient.types';

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

  @Column({ nullable: true })
  medical_technologist: string;

  @Column({ nullable: true })
  pathologist: string;
}
