import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterLoad,
} from 'typeorm';
import type { PatientInfo, MedicalEncounter, SponsorInfo, Summary } from '../types/patient.types';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('jsonb')
  patient_info: PatientInfo;

  @Column('jsonb', { nullable: true })
  sponsor_info: SponsorInfo | null;

  @Column('jsonb', { nullable: true })
  medical_encounters: MedicalEncounter | null;

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
    if (this.patient_info?.date_of_birth) {
      const birthDate = new Date(this.patient_info.date_of_birth);
      this.patient_info.age = this.calculateAge(birthDate, new Date());

      // Now, calculate age_at_visit for each consultation
      if (this.medical_encounters?.consultations) {
        this.medical_encounters.consultations.forEach((consultation) => {
          if (consultation.consultation_date) {
            const consultationDate = new Date(consultation.consultation_date);
            consultation.age_at_visit = this.calculateAge(birthDate, consultationDate);
          } else {
            consultation.age_at_visit = null;
          }
        });
      }

      // Also calculate age_at_visit for each radiology report
      if (this.medical_encounters?.radiology_reports) {
        this.medical_encounters.radiology_reports.forEach((report) => {
          // Assuming radiology reports will have an 'age_at_visit' property.
          // If not, this can be adapted. The logic mirrors consultations.
          if (report.date_performed) {
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
