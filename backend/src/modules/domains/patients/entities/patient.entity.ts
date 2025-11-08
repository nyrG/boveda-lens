import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Summary } from '../types/patient.types';
import { Record } from '../../../shared/records/entities/record.entity';
import { Consultation } from './consultation.entity';
import { LabReport } from './lab-report.entity';
import { RadiologyReport } from './radiology-report.entity';
import { Sponsor } from './sponsor.entity';
import { PatientCategory } from './patient-category.entity';
import { PatientAddress } from './patient-address.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column({ length: 1, nullable: true })
  middle_initial: string;

  @Column()
  last_name: string;

  @Column({ name: 'patient_record_number', unique: true })
  patient_record_number: string;

  @Column({ nullable: true })
  afpsn: string;

  @Column({ type: 'date', name: 'date_of_birth' })
  date_of_birth: string;

  // This 'age' column represents the age listed during the patient's visit on the record.
  // It will be populated by the extraction feature or calculated once from date_of_birth if not provided.
  @Column({ name: 'age', type: 'int', nullable: true })
  age: number | null;

  @Column({
    type: 'enum',
    enum: ['M', 'F'],
    nullable: true,
  })
  sex: 'M' | 'F' | null;

  @Column({ name: 'branch_of_service', nullable: true })
  branch_of_service: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ name: 'unit_assignment', nullable: true })
  unit_assignment: string;

  @ManyToOne(() => PatientCategory, (category) => category.patients, {
    nullable: true,
    eager: true, // Automatically load the category with the patient
  })
  @JoinColumn({ name: 'category_id' })
  category: PatientCategory | null;

  @OneToOne(() => Record, (record) => record.patient, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'record_id' })
  record: Record;

  @OneToMany(() => Consultation, (consultation) => consultation.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  consultations?: Consultation[];

  @OneToMany(() => LabReport, (labReport) => labReport.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  lab_reports?: LabReport[];

  @OneToMany(() => RadiologyReport, (radiologyReport) => radiologyReport.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  radiology_reports?: RadiologyReport[];

  @ManyToOne(() => Sponsor, (sponsor) => sponsor.patients, {
    cascade: ['insert', 'update', 'remove'],
    nullable: true,
  })
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: Sponsor | null;

  // Direct one-to-many relationship with PatientAddress
  @OneToMany(() => PatientAddress, (address) => address.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  addresses?: PatientAddress[];

  @Column('jsonb', { nullable: true })
  summary: Summary | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
