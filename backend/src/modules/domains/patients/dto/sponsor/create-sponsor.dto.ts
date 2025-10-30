import { IsString, IsOptional, IsNumber, IsNotEmpty, Length, IsIn } from 'class-validator';

export class CreateSponsorDto {
  @IsNumber()
  @IsNotEmpty()
  patient_id: number;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 1, { message: 'Middle initial must be a single character' })
  middle_initial?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  rank?: string;

  @IsOptional()
  @IsString()
  afpsn?: string;

  @IsOptional()
  @IsString()
  branch_of_service?: string;

  @IsOptional()
  @IsString()
  unit_assignment?: string;

  @IsOptional()
  @IsIn(['M', 'F'])
  sex?: 'M' | 'F';
}
