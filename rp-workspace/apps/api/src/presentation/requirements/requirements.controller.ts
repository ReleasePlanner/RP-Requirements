import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RequirementsService } from '@application/requirements/services/requirements.service';
import { CreateRequirementDto } from '@application/requirements/dto/create-requirement.dto';
import { UpdateRequirementDto } from '@application/requirements/dto/update-requirement.dto';
import { Requirement } from '@domain/entities/requirement.entity';
import { Public } from '@shared/decorators/public.decorator';

/**
 * Requirements Controller
 * 
 * Handles HTTP requests for requirement management including CRUD operations and smoke tests
 */
@ApiTags('requirements')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'requirements', version: '1' })
export class RequirementsController {
  constructor(private readonly requirementsService: RequirementsService) { }

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
   * Creates a new requirement
   * 
   * @param createRequirementDto - Data for creating the requirement
   * @returns Created requirement entity
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo requisito' })
  @ApiResponse({
    status: 201,
    description: 'Requisito creado exitosamente',
    type: Requirement,
  })
  async create(@Body() createRequirementDto: CreateRequirementDto): Promise<Requirement> {
    return this.requirementsService.create(createRequirementDto);
  }

  /**
   * Retrieves all requirements with optional pagination and filtering
   * 
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 10)
   * @param sortBy - Field to sort by
   * @param sortOrder - Sort order (ASC or DESC)
   * @param epicIds - Comma-separated list of epic IDs to filter by
   * @returns Paginated list of requirements with total count
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los requisitos con paginación' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @ApiQuery({ name: 'epicIds', required: false, description: 'Comma separated list of epic IDs' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de requisitos',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('epicIds') epicIds?: string,
  ): Promise<{ items: Requirement[]; total: number }> {
    return this.requirementsService.findAll({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sortBy,
      sortOrder,
      epicIds: epicIds ? epicIds.split(',') : undefined,
    });
  }

  /**
   * Retrieves a requirement by ID
   * 
   * @param id - Unique identifier of the requirement
   * @returns Requirement entity
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener requisito por ID' })
  @ApiResponse({
    status: 200,
    description: 'Requisito encontrado',
    type: Requirement,
  })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado' })
  async findOne(@Param('id') id: string): Promise<Requirement> {
    return this.requirementsService.findOne(id);
  }

  /**
   * Updates an existing requirement
   * 
   * @param id - Unique identifier of the requirement to update
   * @param updateRequirementDto - Data for updating the requirement
   * @returns Updated requirement entity
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar requisito' })
  @ApiResponse({
    status: 200,
    description: 'Requisito actualizado exitosamente',
    type: Requirement,
  })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateRequirementDto: UpdateRequirementDto,
  ): Promise<Requirement> {
    return this.requirementsService.update(id, updateRequirementDto);
  }

  /**
   * Deletes a requirement by ID
   * 
   * @param id - Unique identifier of the requirement to delete
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar requisito' })
  @ApiResponse({ status: 200, description: 'Requisito eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Requisito no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.requirementsService.delete(id);
  }
}
