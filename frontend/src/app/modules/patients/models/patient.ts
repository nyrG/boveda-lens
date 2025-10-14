export interface Patient {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    patient_info: PatientInfo;
    sponsor_info?: SponsorInfo;
    summary?: Summary;
    medical_encounters?: MedicalEncounters;
}

export interface PatientInfo {
    patient_record_number: string;
    date_of_birth: string;
    age: number;
    documented_age: number;
    sex: 'M' | 'F';
    category: string;
    address?: Address;
    full_name?: FullName;
    afpsn?: string;
    branch_of_service?: string;
    rank?: string;
    unit_assignment?: string;
}

export interface SponsorInfo {
    // Define sponsor properties if needed in the future
}

export interface Summary {
    final_diagnosis: string | string[];
    key_findings?: string;
    medications_taken?: string[];
    allergies?: string[];
}

export interface MedicalEncounters {
    // Define encounter properties if needed in the future
}

export interface Address {
    house_no_street?: string;
    barangay?: string;
    city_municipality?: string;
    province?: string;
    zip_code?: string;
}

export interface FullName {
    first_name?: string;
    middle_initial?: string;
    last_name?: string;
}