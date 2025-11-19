import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';

export class CreateSponsorDto {
  @ApiPropertyOptional({ example: 'John', description: "Sponsor's first name" })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({ example: 'M', description: "Sponsor's middle initial", maxLength: 1 })
  @IsString()
  @IsOptional()
  @MaxLength(1)
  middle_initial?: string;

  @ApiPropertyOptional({ example: 'Doe', description: "Sponsor's last name" })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({ example: 'SGT', description: 'Military rank of the sponsor' })
  @IsString()
  @IsOptional()
  rank?: string;

  @ApiPropertyOptional({
    enum: ['M', 'F'],
    example: 'M',
    description: 'Sex of the sponsor',
    nullable: true,
  })
  @IsEnum(['M', 'F'], {
    message: 'sex must be one of the following values: M, F',
  })
  @IsOptional()
  sex?: 'M' | 'F' | null;

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
