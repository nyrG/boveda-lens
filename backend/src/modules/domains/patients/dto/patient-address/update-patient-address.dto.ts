import { IsNotEmpty, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { AddressDto } from '../../../../shared/addresses/dto/address.dto';

export class UpdatePatientAddressDto extends PartialType(AddressDto) {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
