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
  name: string;

  @ManyToOne(() => RecordType, (recordType) => recordType.records)
  @JoinColumn({ name: 'record_type_id' }) // This links this relation to the DB column
  record_type: RecordType;

  @Column()
  record_type_id: number;

  @OneToOne(() => Patient, (patient) => patient.record)
  patient: Patient;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
