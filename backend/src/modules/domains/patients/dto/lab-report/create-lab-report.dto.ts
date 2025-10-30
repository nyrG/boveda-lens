import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

class TestResultDto {
  @IsString()
  @IsOptional()
  test_name?: string;

  @IsDefined()
  @IsOptional()
  value?: string | number | null;

  @IsString()
  @IsOptional()
  reference_range?: string;

  @IsString()
  @IsOptional()
  unit?: string;
}

export class CreateLabReportDto {
  @IsNumber()
  @IsNotEmpty()
  patient_id: number;

  @IsOptional()
  @IsString()
  test_type?: string;

  @IsOptional()
  @IsDateString()
  date_performed?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestResultDto)
  results?: TestResultDto[];

  @IsOptional()
  @IsString()
  medical_technologist?: string;

  @IsOptional()
  @IsString()
  pathologist?: string;
}
