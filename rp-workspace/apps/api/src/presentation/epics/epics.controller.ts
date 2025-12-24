import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EpicsService } from '@application/epics/services/epics.service';
import { CreateEpicDto } from '@application/epics/dtos/create-epic.dto';
import { UpdateEpicDto } from '@application/epics/dtos/update-epic.dto';
import { Epic } from '@domain/entities/epic.entity';
import { Public } from '@shared/decorators/public.decorator';

/**
 * Epics Controller
 * 
 * Handles HTTP requests for epic management including CRUD operations and smoke tests
 */
@ApiTags('epics')
@ApiBearerAuth('JWT-auth')
@Controller('epics')
export class EpicsController {
  constructor(private readonly epicsService: EpicsService) { }

  /**
   * Smoke test endpoint for health checks
   * 
   * @returns Simple success response
   */
  @Public()
  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test endpoint' })
  @ApiResponse({ status: 200, description: 'Service is operational' })
  async test(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Creates a new epic
   * 
   * @param createEpicDto - Data for creating the epic
   * @returns Created epic entity
   */
  @Post()
  @ApiOperation({ summary: 'Create a new epic' })
  @ApiResponse({ status: 201, description: 'The epic has been successfully created.', type: Epic })
  create(@Body() createEpicDto: CreateEpicDto) {
    return this.epicsService.create(createEpicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all epics' })
  @ApiResponse({ status: 200, description: 'Return all epics.', type: [Epic] })
  findAll(@Query('initiativeId') initiativeId?: string) {
    return this.epicsService.findAll({ initiativeId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific epic' })
  @ApiResponse({ status: 200, description: 'Return the epic.', type: Epic })
  @ApiResponse({ status: 404, description: 'Epic not found.' })
  findOne(@Param('id') id: string) {
    return this.epicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an epic' })
  @ApiResponse({ status: 200, description: 'The epic has been successfully updated.', type: Epic })
  @ApiResponse({ status: 404, description: 'Epic not found.' })
  update(@Param('id') id: string, @Body() updateEpicDto: UpdateEpicDto) {
    return this.epicsService.update(id, updateEpicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an epic' })
  @ApiResponse({ status: 200, description: 'The epic has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Epic not found.' })
  remove(@Param('id') id: string) {
    return this.epicsService.remove(id);
  }
}
