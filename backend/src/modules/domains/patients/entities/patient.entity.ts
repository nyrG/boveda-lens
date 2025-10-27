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
import type { PatientInfo, Summary } from '../types/patient.types';
import { Record } from '../../../shared/records/entities/record.entity';
import { Consultation } from './consultation.entity';
import { LabReport } from './lab-report.entity';
import { RadiologyReport } from './radiology-report.entity';
import { Sponsor } from './sponsor.entity';
import { PatientCategory } from './patient-category.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('jsonb')
  patient_info: PatientInfo;

  @Column('jsonb', { nullable: true })
  summary: Summary | null;

  @OneToOne(() => Record, (record) => record.patient)
  record: Record;

  @OneToMany(() => Consultation, (consultation) => consultation.patient)
  consultations: Consultation[];

  @OneToMany(() => LabReport, (labReport) => labReport.patient)
  lab_reports: LabReport[];

  @OneToMany(() => RadiologyReport, (radiologyReport) => radiologyReport.patient)
  radiology_reports: RadiologyReport[];

  @OneToMany(() => Sponsor, (sponsor) => sponsor.patient)
  sponsors: Sponsor[];

  @ManyToOne(() => PatientCategory, (category) => category.patients, {
    nullable: true,
    eager: true, // Automatically load the category with the patient
  })
  @JoinColumn({ name: 'category_id' })
  category: PatientCategory;

  // This column will store the foreign key for the category
  @Column({ nullable: true })
  category_id: number;

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
    if (this.patient_info?.date_of_birth) {
      const birthDate = new Date(this.patient_info.date_of_birth);
      this.patient_info.age = this.calculateAge(birthDate, new Date());

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
    } else {
      // Ensure age is null if date_of_birth is missing
      if (this.patient_info) this.patient_info.age = null;
    }
  }
}
