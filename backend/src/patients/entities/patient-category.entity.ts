import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
