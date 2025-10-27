import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../../../domains/patients/entities/patient.entity';
import { RecordType } from './record-type.entity';

@Entity('records')
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Display name for the record, e.g., patient's name

  @Column({ name: 'record_type_id' })
  recordTypeId: number;

  @ManyToOne(() => RecordType, (recordType) => recordType.records, {
    eager: true, // Automatically load the record type
  })
  @JoinColumn({ name: 'record_type_id' })
  recordType: RecordType;

  @OneToOne(() => Patient, (patient) => patient.record)
  patient: Patient;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
