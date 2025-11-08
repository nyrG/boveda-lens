import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('sponsors')
export class Sponsor {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Patient, (patient) => patient.sponsor)
  patients: Patient[];

  @Column({ nullable: true }) // Already nullable, which is good
  first_name: string;

  @Column({ length: 1, nullable: true })
  middle_initial: string;

  @Column({ nullable: true }) // Already nullable
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
