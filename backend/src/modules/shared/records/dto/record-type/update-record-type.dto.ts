import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordTypeDto } from './create-record-type.dto';

export class UpdateRecordTypeDto extends PartialType(CreateRecordTypeDto) {}
