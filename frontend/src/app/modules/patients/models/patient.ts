// This file is now aligned with the backend's `patient.entity.ts`

import { Record } from '../../../shared/models/record';

export interface Patient {
    id: number;
    first_name: string;
    middle_initial: string | null;
    last_name: string;
    patient_record_number: string | null;
    afpsn: string | null;
    date_of_birth: string;
    age: number | null;
    sex: 'M' | 'F' | null;
    branch_of_service: string | null;
    rank: string | null;
    unit_assignment: string | null;
    category: PatientCategory | null;
    record: Record;
    consultations: Consultation[];
    lab_reports: LabReport[];
    radiology_reports: RadiologyReport[];
    sponsor: Sponsor | null;
    addresses: Address[];
    summary: Summary | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface PatientCategory {
    id: number;
    name: string;
    description: string;
}

export interface Sponsor {
    id: number;
    rank: string;
    first_name: string; // This remains non-nullable as per our previous validation change
    middle_initial: string | null;
    last_name: string | null;
    sex: 'M' | 'F' | null;
    afpsn: string;
    branch_of_service: string;
    unit_assignment: string;
}

export interface Summary {
    diagnoses: string[];
    primary_complaint?: string;
    key_findings?: string;
    medications_prescribed?: string[];
    allergies?: string[];
}

export interface Consultation {
    id: number;
    consultation_date: string | null;
    age_at_visit: number | null;
    height_cm?: number | null;
    weight_kg?: number | null;
    temperature_c?: number | null;
    chief_complaint?: string;
    diagnosis?: string;
    notes?: string;
    treatment_plan?: string;
    attending_physician?: string;
}

export interface LabReport {
    id: number;
    test_type?: string;
    date_performed?: string | null;
    results?: TestResult[];
    medical_technologist?: string;
    pathologist?: string;
}

export interface TestResult {
    test_name?: string;
    value?: string | number | null;
    reference_range?: string;
    unit?: string;
}

export interface RadiologyReport {
    id: number;
    examination?: string;
    date_performed?: string | null;
    age_at_visit?: number | null; // Calculated on backend
    findings?: string;
    impression?: string;
    radiologist?: string;
}

export enum AddressType {
    RESIDENCE = 'RESIDENCE',
    MAILING = 'MAILING',
    EMERGENCY = 'EMERGENCY',
}

export interface Address {
    id: number;
    houseNoStreet?: string;
    barangay?: string;
    cityMunicipality?: string;
    province?: string;
    zipCode?: string;
    addressType?: AddressType;
}

export interface PatientStats {
    totalPatients: number;
    recentlyUpdated: number;
    categories: { category: string; count: string }[];
    topDiagnoses: { diagnosis: string; count: string }[];
    averageAge: string | null;
}