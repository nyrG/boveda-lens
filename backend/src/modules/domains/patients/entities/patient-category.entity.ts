import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('patient_categories')
export class PatientCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., "Active Duty", "Dependent", "Veteran"

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Patient, (patient) => patient.category)
  patients: Patient[];
}
