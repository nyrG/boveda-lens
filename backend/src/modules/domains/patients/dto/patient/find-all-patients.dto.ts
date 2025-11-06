import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindAllPatientsDto {
  @ApiPropertyOptional({ description: 'Page number for pagination.', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Search term to filter patients by name.' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by.',
    enum: [
      'name',
      'patient_record_number',
      'final_diagnosis',
      'category',
      'created_at',
      'updated_at',
    ],
    default: 'updated_at',
  })
  @IsOptional()
  @IsString()
  sortBy: string = 'updated_at';

  @ApiPropertyOptional({ description: 'Sort order.', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Filter patients by a specific category name.' })
  @IsOptional()
  @IsString()
  category?: string;
}
