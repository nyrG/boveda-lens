import { PartialType } from '@nestjs/mapped-types';
import { CreateRadiologyReportDto } from './create-radiology-report.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateRadiologyReportDto extends PartialType(CreateRadiologyReportDto) {
  @IsOptional()
  @IsInt()
  id?: number;
}
