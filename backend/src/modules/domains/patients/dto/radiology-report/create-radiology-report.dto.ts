import { IsString, IsOptional, IsDateString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateRadiologyReportDto {
  @IsNumber()
  @IsNotEmpty()
  patient_id: number;

  @IsOptional()
  @IsString()
  examination?: string;

  @IsOptional()
  @IsDateString()
  date_performed?: string;

  @IsOptional()
  @IsString()
  findings?: string;

  @IsOptional()
  @IsString()
  impression?: string;

  @IsOptional()
  @IsString()
  radiologist?: string;
}
