import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { AddressEntityType } from '../../../../common/enums/address-entity.enum';
import { AddressType } from '../entities/address.entity';

export class CreateAddressDto {
  @IsNumber()
  @IsNotEmpty()
  entityId: number;

  @IsEnum(AddressEntityType)
  @IsNotEmpty()
  entityType: AddressEntityType;

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
