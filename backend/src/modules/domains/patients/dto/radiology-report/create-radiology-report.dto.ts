import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateRadiologyReportDto {
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
