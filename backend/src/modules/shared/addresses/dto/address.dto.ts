import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AddressType } from '../entities/address.entity';

export class AddressDto {
  @IsEnum(AddressType)
  @IsNotEmpty()
  addressType: AddressType;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  houseNoStreet?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  barangay?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  cityMunicipality?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  province?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  zipCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;
}
