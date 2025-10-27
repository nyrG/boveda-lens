/**
 * Represents the structure of the `patient_info` JSONB column.
 * Used by both the entity and DTOs.
 */
export interface PatientInfo {
  patient_record_number?: string;
  full_name?: {
    first_name?: string;
    middle_initial?: string;
    last_name?: string;
  };
  date_of_birth?: string;
  age?: number | null; // Calculated field
  documented_age?: number | null;
  sex?: 'M' | 'F' | null;
  address?: {
    house_no_street?: string;
    barangay?: string;
    city_municipality?: string;
    province?: string;
    zip_code?: string;
  };
  rank?: string;
  afpsn?: string;
  branch_of_service?: string;
  unit_assignment?: string;
  category?: string;
}

/**
 * Represents the structure of the `sponsor_info` JSONB column.
 */
export interface SponsorInfo {
  afpsn?: string;
  branch_of_service?: string;
  unit_assignment?: string;
  sponsor_name?: {
    rank?: string;
    first_name?: string;
    middle_initial?: string;
    last_name?: string;
  };
  sex?: 'M' | 'F' | null;
}

/**
 * Represents the vitals taken during a consultation.
 */
export interface Vitals {
  height_cm?: number | null;
  weight_kg?: number | null;
  temperature_c?: number | null;
}

/**
 * Represents a single consultation within the `medical_encounters`.
 */
export interface Consultation {
  consultation_date?: string;
  age_at_visit?: number | null; // Calculated field
  vitals?: Vitals;
  attending_physician?: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
}

/**
 * Represents a single radiology report within `medical_encounters`.
 */
export interface RadiologyReport {
  examination?: string;
  age_at_visit?: number | null; // Calculated field
  date_performed?: string;
  findings?: string;
  impression?: string;
  radiologist?: string;
}

/**
 * Represents a single test result within a lab report.
 */
export interface TestResult {
  test_name?: string;
  value?: string | number | null;
  reference_range?: string;
  unit?: string;
}

/**
 * Represents a single lab result report within `medical_encounters`.
 */
export interface LabResult {
  test_type?: string;
  date_performed?: string;
  results?: TestResult[];
}

/**
 * Represents the structure of the `medical_encounters` JSONB column.
 */
export interface MedicalEncounter {
  consultations?: Consultation[];
  radiology_reports?: RadiologyReport[];
  lab_results?: LabResult[];
}

/**
 * Represents the structure of the `summary` JSONB column.
 */
export interface Summary {
  diagnoses?: string[];
  primary_complaint?: string;
  key_findings?: string;
  medications_prescribed?: string[];
  allergies?: string[];
}

/**
 * Represents the shape of the JSON object returned by the Gemini API after data extraction.
 */
export interface ExtractedPatientData {
  patient_info: PatientInfo;
  sponsor_info?: SponsorInfo;
  medical_encounters: MedicalEncounter;
  extraction_info?: {
    model_used: string;
    processed_at: string;
  };
}

// Define interfaces for the shapes of raw query results to ensure type safety.
export interface CategoryStat {
  category: string;
  count: string; // COUNT(*) from a raw query is often returned as a string.
}

export interface DiagnosisStat {
  diagnosis: string;
  count: string;
}

export interface AvgAgeResult {
  avgAge: string | null; // The result of AVG can be null if there are no rows.
}
