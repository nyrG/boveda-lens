import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  MaxLength,
  IsInt,
  IsObject,
} from 'class-validator';

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
}
