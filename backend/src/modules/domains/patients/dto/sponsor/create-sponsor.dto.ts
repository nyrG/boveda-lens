import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateSponsorDto {
  @ApiProperty({ example: 'John', description: "Sponsor's first name" })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ example: 'M', description: "Sponsor's middle initial", maxLength: 1 })
  @IsString()
  @IsOptional()
  @MaxLength(1)
  middle_initial?: string;

  @ApiProperty({ example: 'Doe', description: "Sponsor's last name" })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'Spouse', description: 'Relationship to the patient' })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({ enum: ['M', 'F'], example: 'M', description: 'Sex of the sponsor' })
  @IsEnum(['M', 'F'])
  sex: 'M' | 'F';

  @ApiPropertyOptional({
    example: '7654321',
    description: 'Armed Forces of the Philippines Serial Number of the sponsor',
  })
  @IsString()
  @IsOptional()
  afpsn?: string;

  @ApiPropertyOptional({ example: 'PA', description: 'Branch of Service of the sponsor' })
  @IsString()
  @IsOptional()
  branch_of_service?: string;

  @ApiPropertyOptional({ example: '520th ABW', description: 'Unit assignment of the sponsor' })
  @IsString()
  @IsOptional()
  unit_assignment?: string;
}
