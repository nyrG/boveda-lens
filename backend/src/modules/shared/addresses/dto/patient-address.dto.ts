import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, IsInt } from 'class-validator';
import { AddressType } from '../entities/address.entity';

export class PatientAddressDto {
  @ApiPropertyOptional({ description: 'The ID of the address, required for updates.' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ enum: AddressType, example: AddressType.RESIDENCE })
  @IsEnum(AddressType)
  @IsNotEmpty()
  addressType: AddressType;

  @ApiProperty({ example: '123 Rizal Street' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  houseNoStreet: string;

  @ApiProperty({ example: 'Poblacion' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  barangay: string;

  @ApiProperty({ example: 'Makati City' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cityMunicipality: string;

  @ApiProperty({ example: 'Metro Manila' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  province: string;

  @ApiPropertyOptional({ example: '1227' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  zipCode?: string;

  @ApiProperty({ example: 'Philippines' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  country: string;
}
