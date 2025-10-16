// backend/src/extraction/extraction.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseFilters,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtractionService } from './extraction.service';
import { GeminiApiExceptionFilter } from './gemini-api.filter'; // 1. Import the filter
import { ExtractedPatientData } from '../patients/types/patient.types';
import { UploadOptionsDto } from './dto/upload-options.dto';

@Controller('extraction')
@UseFilters(new GeminiApiExceptionFilter())
export class ExtractionController {
  constructor(private readonly extractionService: ExtractionService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) uploadOptions: UploadOptionsDto,
  ): Promise<ExtractedPatientData> {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    return this.extractionService.extractDataFromPdf(
      file,
      uploadOptions.model || 'gemini-1.5-flash-latest',
      uploadOptions.documentType,
    );
  }
}
