import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional } from 'class-validator';
import { CreateTestResultDto } from './create-lab-report.dto';

/**
 * Note: We are extending CreateTestResultDto directly, not a separate file,
 * because TestResultDto is defined within create-lab-report.dto.ts.
 * This is acceptable for small, coupled DTOs.
 *
 * We add the 'id' property here to ensure that when a lab report is updated,
 * existing test results within it can be identified and updated, rather than
 * being recreated. This is crucial for TypeORM's cascade-update functionality.
 */
export class UpdateTestResultDto extends PartialType(CreateTestResultDto) {
  @IsOptional()
  @IsInt()
  id?: number;
}
