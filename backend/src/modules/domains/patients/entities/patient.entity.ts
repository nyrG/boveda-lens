import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
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
  })
  sex: 'M' | 'F';

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
  category: PatientCategory;

  @Column({ nullable: true })
  category_id: number;

  @OneToOne(() => Record, (record) => record.patient, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'record_id' })
  record: Record;

  @OneToMany(() => Consultation, (consultation) => consultation.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  consultations: Consultation[];

  @OneToMany(() => LabReport, (labReport) => labReport.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  lab_reports: LabReport[];

  @OneToMany(() => RadiologyReport, (radiologyReport) => radiologyReport.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  radiology_reports: RadiologyReport[];

  @OneToMany(() => Sponsor, (sponsor) => sponsor.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  sponsors: Sponsor[];

  // Direct one-to-many relationship with PatientAddress
  @OneToMany(() => PatientAddress, (address) => address.patient, {
    cascade: ['insert', 'update', 'remove'],
  })
  addresses: PatientAddress[];

  @Column('jsonb', { nullable: true })
  summary: Summary | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  /**
   * Calculates the age based on a birth date and a reference "now" date.
   * @param birthDate The date of birth.
   * @param nowDate The date to calculate the age against.
   * @returns The calculated age in years.
   */
  private calculateAge(birthDate: Date, nowDate: Date): number {
    let age = nowDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = nowDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && nowDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  @AfterLoad()
  calculateAges() {
    if (this.date_of_birth) {
      const birthDate = new Date(this.date_of_birth);
      // Note: 'age' is a calculated, non-persistent property.

      // Now, calculate age_at_visit for each consultation
      if (this.consultations) {
        this.consultations.forEach((consultation) => {
          if (consultation.consultation_date) {
            const consultationDate = new Date(consultation.consultation_date);
            consultation.age_at_visit = this.calculateAge(birthDate, consultationDate);
          } else {
            // age_at_visit is nullable in the new entity, so it will be undefined/null if no date
          }
        });
      }

      // Also calculate age_at_visit for each radiology report
      if (this.radiology_reports) {
        this.radiology_reports.forEach((report) => {
          // Assuming radiology reports will have an 'age_at_visit' property.
          // If not, this can be adapted. The logic mirrors consultations.
          if (report.date_performed) {
            // Assuming date_performed exists on the new entity
            const reportDate = new Date(report.date_performed);
            report.age_at_visit = this.calculateAge(birthDate, reportDate);
          }
        });
      }
    }
  }
}
