import { PartialType } from '@nestjs/mapped-types';
import { CreateLabReportDto } from './create-lab-report.dto';

export class UpdateLabReportDto extends PartialType(CreateLabReportDto) {}
