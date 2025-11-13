/**
 * Represents a single consultation within the `medical_encounters`.
 */
export interface Consultation {
  consultation_date?: string;
  age_at_visit?: number | null; // Calculated field
  height_cm?: number | null;
  weight_kg?: number | null;
  temperature_c?: number | null;
  attending_physician?: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  notes?: string;
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
export interface LabReport {
  test_type?: string;
  date_performed?: string;
  results?: TestResult[];
  medical_technologist?: string;
  pathologist?: string;
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
 * Represents a single sponsor.
 */
export interface Sponsor {
  rank?: string;
  first_name?: string;
  middle_initial?: string;
  last_name?: string;
  sex?: 'M' | 'F' | null;
  afpsn?: string;
  branch_of_service?: string;
  unit_assignment?: string;
}

/**
 * Represents the shape of the JSON object returned by the Gemini API after data extraction.
 * This structure is flat and aligns with the `CreatePatientDto`.
 */
export interface ExtractedPatientData {
  first_name?: string;
  middle_initial?: string;
  last_name?: string;
  patient_record_number?: string;
  date_of_birth?: string;
  age?: number | null;
  sex?: 'M' | 'F' | null;
  rank?: string;
  afpsn?: string;
  branch_of_service?: string;
  unit_assignment?: string;
  category?: { name: string };
  addresses?: any[]; // Using 'any' for simplicity as DTO is sufficient
  sponsor?: Sponsor;
  consultations?: Consultation[];
  lab_reports?: LabReport[];
  radiology_reports?: RadiologyReport[];
  summary?: Summary;
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
