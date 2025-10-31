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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateConsultationDto } from '../consultation/create-consultation.dto';
import { CreateLabReportDto } from '../lab-report/create-lab-report.dto';
import { CreateRadiologyReportDto } from '../radiology-report/create-radiology-report.dto';
import { CreateSponsorDto } from '../sponsor/create-sponsor.dto';

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

  @ApiProperty({ example: 'P-123456', description: 'Unique patient record number' })
  @IsString()
  @IsNotEmpty()
  patient_record_number: string;

  @ApiProperty({ example: '1990-05-15', description: 'Date of birth in YYYY-MM-DD format' })
  @IsDateString()
  date_of_birth: string;

  @ApiPropertyOptional({ example: 34, description: 'Age of the patient if documented manually' })
  @IsInt()
  @IsOptional()
  documented_age?: number;

  @ApiProperty({ enum: ['M', 'F'], example: 'M', description: 'Sex of the patient' })
  @IsEnum(['M', 'F'])
  sex: 'M' | 'F';

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

  @ApiPropertyOptional({ example: 1, description: 'ID of the patient category' })
  @IsInt()
  @IsOptional()
  category_id?: number;

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
    type: () => [CreateSponsorDto],
    description: 'List of sponsors for the patient',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSponsorDto)
  sponsors?: CreateSponsorDto[];
}
