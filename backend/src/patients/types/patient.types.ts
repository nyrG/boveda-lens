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
  sponsor_name?: {
    first_name?: string;
    middle_initial?: string;
    last_name?: string;
  };
  sex?: 'M' | 'F' | null;
  // Add other sponsor properties here if needed
}

/**
 * Represents a single consultation within the `medical_encounters`.
 */
export interface Consultation {
  consultation_date?: string;
  age_at_visit?: number | null; // Calculated field
  attending_physician?: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
}

/**
 * Represents the structure of the `medical_encounters` JSONB column.
 */
export interface MedicalEncounter {
  consultations?: Consultation[];
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
