import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AddressType } from '../entities/address.entity';

export class AddressDto {
  @IsEnum(AddressType)
  @IsNotEmpty()
  addressType: AddressType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  houseNoStreet: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  barangay: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cityMunicipality: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  province: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;
}
