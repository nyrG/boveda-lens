import { CreatePatientDto } from '../dto/patient/create-patient.dto';
import { UpdatePatientDto } from '../dto/patient/update-patient.dto';

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
  // Format patient name
  dto.first_name = toTitleCase(dto.first_name);
  dto.last_name = toTitleCase(dto.last_name);

  // Format patient address
  dto.addresses?.forEach((address) => {
    address.house_no_street = toTitleCase(address.house_no_street);
    address.barangay = toTitleCase(address.barangay);
    address.city_municipality = toTitleCase(address.city_municipality);
    address.province = toTitleCase(address.province);
  });

  // Format sponsor name
  if (dto.sponsor) {
    dto.sponsor.first_name = toTitleCase(dto.sponsor.first_name);
    dto.sponsor.last_name = toTitleCase(dto.sponsor.last_name);
  }

  // Format attending physician in consultations
  dto.consultations?.forEach((consultation) => {
    if (consultation.attending_physician) {
      consultation.attending_physician = toTitleCase(consultation.attending_physician);
    }
  });
};
