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
import { CreatePatientDto, IdsDto } from './dto/patient/create-patient.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Patient } from './entities/patient.entity';
import { FindAllPatientsDto } from './dto/patient/find-all-patients.dto';
import { UpdatePatientDto } from './dto/patient/update-patient.dto';

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

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics about patients' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved patient statistics.' })
  getStats() {
    return this.patientsService.getStats();
  }

  @Get('sponsors/search')
  @ApiOperation({ summary: 'Search for sponsors by name' })
  @ApiQuery({ name: 'name', required: true, type: String })
  searchSponsors(@Query('name') name: string) {
    return this.patientsService.findSponsorsByName(name);
  }

  @Delete('sponsors/:id')
  @ApiOperation({ summary: 'Delete a sponsor by ID' })
  @ApiResponse({ status: 200, description: 'The sponsor has been successfully deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Sponsor with the specified ID does not exist.',
  })
  removeSponsor(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.removeSponsor(id);
  }

  // The parameterized route ':id' now comes AFTER the specific 'stats' route.
  @Get(':id')
  @ApiOperation({ summary: 'Find a patient by ID' })
  @ApiResponse({
    status: 200,
    description: 'The patient record has been successfully retrieved.',
    type: Patient,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Patient with the specified ID does not exist.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all patients with pagination, sorting, and filtering' })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of patients.',
  })
  findAll(@Query() query: FindAllPatientsDto) {
    // The ValidationPipe will automatically validate the query against the DTO.
    // You also need to enable the pipe, usually in main.ts: app.useGlobalPipes(new ValidationPipe({ transform: true }));
    return this.patientsService.findAll(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a patient record' })
  @ApiResponse({
    status: 200,
    description: 'The patient record has been successfully updated.',
    type: Patient,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Patient with the specified ID does not exist.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a patient by ID' })
  @ApiResponse({ status: 200, description: 'The patient has been successfully soft-deleted.' })
  @ApiResponse({
    status: 404,
    description: 'Not Found. Patient with the specified ID does not exist.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Soft-delete multiple patients by their IDs' })
  @ApiResponse({
    status: 200,
    description: 'The specified patient records have been successfully soft-deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. No IDs provided or invalid input.',
  })
  removeMany(@Body() idsDto: IdsDto) {
    return this.patientsService.removeMany(idsDto.ids);
  }
}
