import { PartialType } from '@nestjs/mapped-types';
import { CreateSponsorDto } from './create-sponsor.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {
  @IsOptional()
  @IsInt()
  id?: number;
}
