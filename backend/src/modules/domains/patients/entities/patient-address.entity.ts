// src/modules/domains/patients/entities/patient-address.entity.ts
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Address, AddressType } from '../../../shared/addresses/entities/address.entity';
import { Patient } from './patient.entity';

// Re-export AddressType so it can be imported from this file for convenience.
export { AddressType };

@Entity('patient_addresses')
export class PatientAddress extends Address {
  @ManyToOne(() => Patient, (patient) => patient.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
