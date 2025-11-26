import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AddressType } from '../entities/address.entity';

export class AddressDto {
  @IsEnum(AddressType)
  @IsNotEmpty()
  address_type: AddressType;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  house_no_street?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  barangay?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city_municipality?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  province?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  zip_code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;
}
