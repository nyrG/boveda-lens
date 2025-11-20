import { IsInt, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { AddressDto } from '../../../../shared/addresses/dto/address.dto';

export class UpdatePatientAddressDto extends PartialType(AddressDto) {
  @IsOptional()
  @IsInt()
  id?: number;
}
