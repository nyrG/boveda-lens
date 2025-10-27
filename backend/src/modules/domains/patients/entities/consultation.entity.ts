import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

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

  @Column({ name: 'height_cm', type: 'float', nullable: true })
  height_cm: number;

  @Column({ name: 'weight_kg', type: 'float', nullable: true })
  weight_kg: number;

  @Column({
    name: 'temperature_c',
    type: 'float',
    nullable: true,
  })
  temperature_c: number;

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
}
