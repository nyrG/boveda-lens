import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/swagger';
import { AddressDto } from '../../../../shared/addresses/dto/address.dto';
import { AddressType } from '../../../../shared/addresses/entities/address.entity';

export class UpdatePatientAddressDto extends PartialType(OmitType(AddressDto, ['address_type'])) {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEnum(AddressType)
  @IsNotEmpty()
  address_type: AddressType;
}
