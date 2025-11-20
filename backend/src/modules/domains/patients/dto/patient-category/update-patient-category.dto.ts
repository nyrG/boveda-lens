import { PartialType } from '@nestjs/swagger';
import { PatientCategoryDto } from './patient-category.dto';

/**
 * Makes all properties of PatientCategoryDto optional for update operations.
 */
export class UpdatePatientCategoryDto extends PartialType(PatientCategoryDto) {}
