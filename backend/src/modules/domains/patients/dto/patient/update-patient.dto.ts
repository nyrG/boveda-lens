import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePatientDto } from './create-patient.dto';
import { UpdatePatientAddressDto } from '../patient-address/update-patient-address.dto';
import { UpdateConsultationDto } from '../consultation/update-consultation.dto';
import { UpdateLabReportDto } from '../lab-report/update-lab-report.dto';
import { UpdateRadiologyReportDto } from '../radiology-report/update-radiology-report.dto';
import { UpdateSponsorDto } from '../sponsor/update-sponsor.dto';
import { UpdatePatientCategoryDto } from '../patient-category/update-patient-category.dto';

// To properly override the 'addresses' property for updates (to include an 'id'),
// we first Omit it from the CreatePatientDto, then apply PartialType,
// and finally add it back with the correct update-specific DTO type.
export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, [
    'addresses',
    'consultations',
    'lab_reports',
    'radiology_reports',
    'sponsor',
    'category',
  ]),
) {
  @ApiPropertyOptional({ type: () => UpdatePatientCategoryDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdatePatientCategoryDto)
  category?: UpdatePatientCategoryDto | null;

  @ApiPropertyOptional({
    type: () => [UpdatePatientAddressDto],
    description: 'List of addresses. Include an `id` to update, or omit it to create.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePatientAddressDto)
  addresses?: UpdatePatientAddressDto[];

  @ApiPropertyOptional({ type: () => [UpdateConsultationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateConsultationDto)
  consultations?: UpdateConsultationDto[];

  @ApiPropertyOptional({ type: () => [UpdateLabReportDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateLabReportDto)
  lab_reports?: UpdateLabReportDto[];

  @ApiPropertyOptional({ type: () => [UpdateRadiologyReportDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRadiologyReportDto)
  radiology_reports?: UpdateRadiologyReportDto[];

  @ApiPropertyOptional({ type: () => UpdateSponsorDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSponsorDto)
  sponsor?: UpdateSponsorDto;
}
