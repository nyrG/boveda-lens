import { IsString, IsOptional, IsDateString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateConsultationDto {
  @IsNumber()
  @IsNotEmpty()
  patient_id: number;

  @IsOptional()
  @IsDateString()
  consultation_date?: string;

  @IsOptional()
  @IsNumber()
  height_cm?: number;

  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @IsOptional()
  @IsNumber()
  temperature_c?: number;

  @IsOptional()
  @IsString()
  attending_physician?: string;

  @IsOptional()
  @IsString()
  chief_complaint?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment_plan?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
