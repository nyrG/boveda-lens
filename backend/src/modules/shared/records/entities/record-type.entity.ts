import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Record } from './record.entity';

@Entity({ name: 'record_types' })
export class RecordType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "e.g., 'Patient Medical Record', 'Tax Document'",
  })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Record, (record) => record.recordType)
  records: Record[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
