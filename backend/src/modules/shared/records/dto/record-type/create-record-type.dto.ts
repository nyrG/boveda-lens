import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRecordTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
