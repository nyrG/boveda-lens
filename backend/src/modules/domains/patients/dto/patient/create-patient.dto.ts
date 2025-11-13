import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  MaxLength,
  IsInt,
  IsObject,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateConsultationDto } from '../consultation/create-consultation.dto';
import { CreateLabReportDto } from '../lab-report/create-lab-report.dto';
import { CreateRadiologyReportDto } from '../radiology-report/create-radiology-report.dto';
import { CreateSponsorDto } from '../sponsor/create-sponsor.dto';
import { CreatePatientAddressDto } from '../patient-address/create-patient-address.dto';
import { PatientCategoryDto } from '../patient-category/patient-category.dto';

export class CreatePatientDto {
  @ApiProperty({ example: 'John', description: "Patient's first name" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ example: 'D', description: "Patient's middle initial", maxLength: 1 })
  @IsString()
  @IsOptional()
  @MaxLength(1)
  middle_initial?: string;

  @ApiProperty({ example: 'Doe', description: "Patient's last name" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiPropertyOptional({ example: 'P-123456', description: 'Patient record number' })
  @IsString()
  @IsOptional()
  patient_record_number?: string;

  @ApiProperty({ example: '1990-05-15', description: 'Date of birth in YYYY-MM-DD format' })
  @IsDateString()
  date_of_birth: string;

  @ApiPropertyOptional({
    example: 34,
    description:
      'Age of the patient. If not provided, it will be calculated from the date_of_birth.',
  })
  @IsInt()
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({
    enum: ['M', 'F'],
    example: 'M',
    description: 'Sex of the patient',
    nullable: true,
  })
  @IsEnum(['M', 'F'])
  @IsOptional()
  sex?: 'M' | 'F' | null;

  @ApiPropertyOptional({
    example: '1234567',
    description: 'Armed Forces of the Philippines Serial Number',
  })
  @IsString()
  @IsOptional()
  afpsn?: string;

  @ApiPropertyOptional({ example: 'PA', description: 'Branch of Service (e.g., PA, PN, PAF)' })
  @IsString()
  @IsOptional()
  branch_of_service?: string;

  @ApiPropertyOptional({ example: 'SGT', description: 'Military rank of the patient' })
  @IsString()
  @IsOptional()
  rank?: string;

  @ApiPropertyOptional({ example: '520th ABW', description: 'Unit assignment of the patient' })
  @IsString()
  @IsOptional()
  unit_assignment?: string;

  @ApiPropertyOptional({ description: 'JSON object for patient summary' })
  @IsObject()
  @IsOptional()
  summary?: object;

  @ApiPropertyOptional({
    description: 'The category of the patient. Can be an existing category or a new one.',
    type: () => PatientCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientCategoryDto)
  category?: PatientCategoryDto;

  @ApiPropertyOptional({
    type: () => [CreateConsultationDto],
    description: 'List of consultations for the patient',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConsultationDto)
  consultations?: CreateConsultationDto[];

  @ApiPropertyOptional({
    type: () => [CreateLabReportDto],
    description: 'List of lab reports for the patient',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLabReportDto)
  lab_reports?: CreateLabReportDto[];

  @ApiPropertyOptional({
    type: () => [CreateRadiologyReportDto],
    description: 'List of radiology reports for the patient',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRadiologyReportDto)
  radiology_reports?: CreateRadiologyReportDto[];

  @ApiPropertyOptional({
    type: () => CreateSponsorDto,
    description: 'The sponsor for the patient',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSponsorDto)
  sponsor?: CreateSponsorDto;

  @ApiPropertyOptional({
    type: () => [CreatePatientAddressDto],
    description: 'List of addresses for the patient',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientAddressDto)
  addresses?: CreatePatientAddressDto[];
}

export class IdsDto {
  @ApiProperty({
    description: 'An array of patient IDs to perform a bulk operation on.',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
