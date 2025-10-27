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
 * Represents the vitals taken during a consultation.
 * This corresponds to the structure of the 'vitals' JSONB column.
 */
export interface Vitals {
  height_cm?: number | null;
  weight_kg?: number | null;
  temperature_c?: number | null;
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.consultations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column()
  patient_id: number;

  @Column({ type: 'date', nullable: true })
  consultation_date: string;

  @Column({ type: 'int', nullable: true })
  age_at_visit: number | null;

  @Column('jsonb', { nullable: true })
  vitals: Vitals | null;

  @Column({ nullable: true })
  attending_physician: string;

  @Column({ type: 'text', nullable: true })
  chief_complaint: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment_plan: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
