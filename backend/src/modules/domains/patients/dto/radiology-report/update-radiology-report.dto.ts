import { PartialType } from '@nestjs/mapped-types';
import { CreateRadiologyReportDto } from './create-radiology-report.dto';

export class UpdateRadiologyReportDto extends PartialType(CreateRadiologyReportDto) {}
