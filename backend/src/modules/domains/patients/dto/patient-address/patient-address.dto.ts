import { IsNumber, IsOptional } from 'class-validator';
import { AddressDto } from '../../../../shared/addresses/dto/address.dto';

export class PatientAddressDto extends AddressDto {
  @IsNumber()
  @IsOptional()
  id?: number;
}
