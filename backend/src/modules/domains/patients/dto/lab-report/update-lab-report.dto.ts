import { PartialType } from '@nestjs/mapped-types';
import { CreateLabReportDto } from './create-lab-report.dto';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { UpdateTestResultDto } from './update-test-result.dto';
import { Type } from 'class-transformer';

export class UpdateLabReportDto extends PartialType(CreateLabReportDto) {
  @IsOptional()
  @IsInt()
  id?: number;

  // We must override the 'results' property from the Create DTO
  // to use the UpdateTestResultDto, which includes an 'id'.
  // This ensures that nested test results can also be updated correctly.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTestResultDto)
  results?: UpdateTestResultDto[];
}
