import { ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePatientDto } from './create-patient.dto';
import { PatientAddressDto } from '../patient-address/patient-address.dto';

// To properly override the 'addresses' property for updates (to include an 'id'),
// we first Omit it from the CreatePatientDto, then apply PartialType,
// and finally add it back with the correct update-specific DTO type.
export class UpdatePatientDto extends PartialType(OmitType(CreatePatientDto, ['addresses'])) {
  @ApiPropertyOptional({
    type: () => [PatientAddressDto],
    description:
      'List of addresses for the patient. Include an `id` to update an existing address, or omit it to create a new one.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientAddressDto)
  addresses?: PatientAddressDto[];
}
