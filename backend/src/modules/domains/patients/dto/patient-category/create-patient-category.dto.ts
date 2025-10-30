import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePatientCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
