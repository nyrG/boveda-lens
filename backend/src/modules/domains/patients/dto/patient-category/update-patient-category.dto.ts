import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientCategoryDto } from './create-patient-category.dto';

export class UpdatePatientCategoryDto extends PartialType(CreatePatientCategoryDto) {}
