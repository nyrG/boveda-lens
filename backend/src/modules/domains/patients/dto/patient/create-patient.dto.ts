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
import { Type } from 'class-transformer';
import { CreateConsultationDto } from '../consultation/create-consultation.dto';
import { CreateLabReportDto } from '../lab-report/create-lab-report.dto';
import { CreateRadiologyReportDto } from '../radiology-report/create-radiology-report.dto';
import { CreateSponsorDto } from '../sponsor/create-sponsor.dto';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1)
  middle_initial?: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  patient_record_number: string;

  @IsDateString()
  date_of_birth: string;

  @IsInt()
  @IsOptional()
  documented_age?: number;

  @IsEnum(['M', 'F'])
  sex: 'M' | 'F';

  @IsString()
  @IsOptional()
  afpsn?: string;

  @IsString()
  @IsOptional()
  branch_of_service?: string;

  @IsString()
  @IsOptional()
  rank?: string;

  @IsString()
  @IsOptional()
  unit_assignment?: string;

  @IsObject()
  @IsOptional()
  summary?: object;

  @IsInt()
  @IsOptional()
  category_id?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateConsultationDto)
  consultations?: CreateConsultationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLabReportDto)
  lab_reports?: CreateLabReportDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRadiologyReportDto)
  radiology_reports?: CreateRadiologyReportDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSponsorDto)
  sponsors?: CreateSponsorDto[];
}
