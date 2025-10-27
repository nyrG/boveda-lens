import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('sponsors')
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.sponsors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column()
  patient_id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ length: 1, nullable: true })
  middle_initial: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  afpsn: string;

  @Column({ nullable: true })
  branch_of_service: string;

  @Column({ nullable: true })
  unit_assignment: string;

  @Column({
    type: 'enum',
    enum: ['M', 'F'],
    nullable: true,
  })
  sex: 'M' | 'F' | null;
}
