import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum DocumentType {
  DEPENDENT = 'dependent',
  MILITARY = 'military',
  GENERAL = 'general',
}

export class UploadOptionsDto {
  @IsString()
  @IsOptional()
  model?: string;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;
}
