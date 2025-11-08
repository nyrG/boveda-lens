import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatientCategoryDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
