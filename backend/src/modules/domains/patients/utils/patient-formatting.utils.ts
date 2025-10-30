import { CreatePatientDto } from '../dto/patient/create-patient.dto';
import { UpdatePatientDto } from '../dto/patient/update-patient.dto';
import { MedicalEncounter, PatientInfo, SponsorInfo } from '../types/patient.types';

/**
 * Converts a string to Title Case.
 * @param str The string to convert.
 * @returns The Title Cased string.
 */
const toTitleCase = (str: string | null | undefined): string | undefined => {
  if (!str) return undefined;
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * A helper method to apply title-casing to patient DTO fields.
 * This centralizes the formatting logic for both create and update operations.
 * @param dto The DTO to format (CreatePatientDto or UpdatePatientDto).
 */
export const formatPatientDto = (dto: CreatePatientDto | UpdatePatientDto): void => {
  const info = dto.patient_info as PatientInfo;
  const sponsorInfo = dto.sponsor_info as SponsorInfo;
  const encounters = dto.medical_encounters as MedicalEncounter;

  // Format patient name
  if (info?.full_name) {
    info.full_name.first_name = toTitleCase(info.full_name.first_name);
    info.full_name.last_name = toTitleCase(info.full_name.last_name);
  }

  // Format patient address
  if (info?.address) {
    info.address.house_no_street = toTitleCase(info.address.house_no_street);
    info.address.barangay = toTitleCase(info.address.barangay);
    info.address.city_municipality = toTitleCase(info.address.city_municipality);
    info.address.province = toTitleCase(info.address.province);
  }

  // Format sponsor name
  if (sponsorInfo?.sponsor_name) {
    sponsorInfo.sponsor_name.first_name = toTitleCase(sponsorInfo.sponsor_name.first_name);
    sponsorInfo.sponsor_name.last_name = toTitleCase(sponsorInfo.sponsor_name.last_name);
  }

  // Format attending physician in consultations
  if (encounters?.consultations) {
    encounters.consultations.forEach((consultation) => {
      if (consultation.attending_physician) {
        consultation.attending_physician = toTitleCase(consultation.attending_physician);
      }
    });
  }
};
