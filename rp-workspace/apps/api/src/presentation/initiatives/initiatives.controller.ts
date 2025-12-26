import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InitiativesService } from '@application/initiatives/services/initiatives.service';
import { CreateInitiativeDto } from '@application/initiatives/dtos/create-initiative.dto';
import { UpdateInitiativeDto } from '@application/initiatives/dtos/update-initiative.dto';
import { Initiative } from '@domain/entities/initiative.entity';

@ApiTags('initiatives')
@ApiBearerAuth('JWT-auth')
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly initiativesService: InitiativesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new initiative' })
  @ApiResponse({
    status: 201,
    description: 'The initiative has been successfully created.',
    type: Initiative,
  })
  create(@Body() createInitiativeDto: CreateInitiativeDto) {
    return this.initiativesService.create(createInitiativeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all initiatives' })
  @ApiResponse({ status: 200, description: 'Return all initiatives.', type: [Initiative] })
  findAll(@Query('portfolioId') portfolioId?: string) {
    return this.initiativesService.findAll({ portfolioId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific initiative' })
  @ApiResponse({ status: 200, description: 'Return the initiative.', type: Initiative })
  @ApiResponse({ status: 404, description: 'Initiative not found.' })
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an initiative' })
  @ApiResponse({
    status: 200,
    description: 'The initiative has been successfully updated.',
    type: Initiative,
  })
  @ApiResponse({ status: 404, description: 'Initiative not found.' })
  update(@Param('id') id: string, @Body() updateInitiativeDto: UpdateInitiativeDto) {
    return this.initiativesService.update(id, updateInitiativeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an initiative' })
  @ApiResponse({ status: 200, description: 'The initiative has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Initiative not found.' })
  remove(@Param('id') id: string) {
    return this.initiativesService.remove(id);
  }
}
