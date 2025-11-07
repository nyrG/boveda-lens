import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePatientDto } from './create-patient.dto';
import { PatientAddressDto } from '../patient-address/patient-address.dto';

// We exclude 'addresses' from the PartialType to override it with a compatible type.
export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiPropertyOptional({
    type: () => [PatientAddressDto],
    description: 'List of addresses to create or update for the patient.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientAddressDto)
  addresses?: PatientAddressDto[];
}
