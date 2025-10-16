export interface Patient {
    id: number;
    // The 'name' property is dynamically generated on the backend (firstName + lastName)
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
    date_of_birth: string | null;
    age: number | null; // This is calculated on the backend
    documented_age: number | null;
    sex: 'M' | 'F' | null;
    category: string;
    address?: Address | null;
    full_name?: FullName;
    afpsn?: string;
    branch_of_service?: string;
    rank?: string;
    unit_assignment?: string;
}

export interface SponsorInfo {
    sponsor_name?: SponsorName;
    sex?: 'M' | 'F' | null;
    afpsn?: string;
    branch_of_service?: string;
    unit_assignment?: string;
}

export interface SponsorName {
    rank?: string;
    first_name?: string;
    middle_initial?: string;
    last_name?: string;
}

export interface Summary {
    final_diagnosis: string[];
    primary_complaint?: string;
    key_findings?: string;
    medications_taken?: string[];
    allergies?: string[];
}

export interface MedicalEncounters {
    consultations?: Consultation[];
    lab_results?: LabResult[];
    radiology_reports?: RadiologyReport[];
}

export interface Consultation {
    consultation_date: string | null;
    age_at_visit: number | null; // This is calculated on the backend
    vitals?: Vitals;
    chief_complaint?: string;
    diagnosis?: string;
    notes?: string;
    treatment_plan?: string;
    attending_physician?: string;
}

export interface Vitals {
    height_cm?: number | null;
    weight_kg?: number | null;
    temperature_c?: number | null;
}

export interface LabResult {
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
    examination?: string;
    date_performed?: string | null;
    findings?: string;
    impression?: string;
    radiologist?: string;
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

export interface PatientStats {
    totalPatients: number;
    recentlyUpdated: number;
    categories: { category: string; count: string }[];
    topDiagnoses: { diagnosis: string; count: string }[];
    averageAge: string;
}