import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PatientCategoryDto {
  @ApiPropertyOptional({ description: 'The unique identifier of the category.' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'The name of the category (e.g., "EDM", "ODS").' })
  @IsString()
  name: string;
}
