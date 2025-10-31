import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/patient/create-patient.dto';
import { UpdatePatientDto } from './dto/patient/update-patient.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';

@ApiTags('Patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient record' })
  @ApiResponse({
    status: 201,
    description: 'The patient has been successfully created.',
    type: Patient,
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  /* @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get('stats')
  getStats() {
    return this.patientsService.getStats();
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'updated_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('category') category?: string,
  ) {
    return this.patientsService.findAll(page, limit, search, sortBy, sortOrder, category);
  }

  // The parameterized route ':id' now comes AFTER the specific 'stats' route.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }

  @Delete()
  removeMany(@Body('ids') ids: number[]) {
    return this.patientsService.removeMany(ids);
  } */
}
