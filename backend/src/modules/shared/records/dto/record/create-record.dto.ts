import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  recordTypeId: number;
}
