import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogsService } from '@application/catalogs/services/catalogs.service';
import { Priority } from '@domain/entities/priority.entity';
import { LifecycleStatus } from '@domain/entities/lifecycle-status.entity';
import { RiskLevel } from '@domain/entities/risk-level.entity';
import { Complexity } from '@domain/entities/complexity.entity';
import { EffortEstimateType } from '@domain/entities/effort-estimate-type.entity';
import { RequirementType } from '@domain/entities/requirement-type.entity';
import { VerificationMethod } from '@domain/entities/verification-method.entity';
import { Metric } from '@domain/entities/metric.entity';
import { ProductOwner } from '@domain/entities/product-owner.entity';
import { CreateCatalogDto } from '@application/catalogs/dto/create-catalog.dto';
import { UpdateCatalogDto } from '@application/catalogs/dto/update-catalog.dto';
import { CreateMetricDto } from '@application/catalogs/dto/create-metric.dto';
import { UpdateMetricDto } from '@application/catalogs/dto/update-metric.dto';
import { CreateProductOwnerDto } from '@application/catalogs/dto/create-product-owner.dto';
import { UpdateProductOwnerDto } from '@application/catalogs/dto/update-product-owner.dto';
import {
  CreateApproverDto,
  UpdateApproverDto,
} from '@application/catalogs/dto/create-approver.dto';
import { Approver } from '../../domain/entities/approver.entity';
import { Public } from '@shared/decorators/public.decorator';

/**
 * Catalogs Controller
 *
 * Handles HTTP requests for catalog management including CRUD operations and smoke tests
 */
@ApiTags('catalogs')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'catalogs', version: '1' })
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

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
   * Retrieves all priorities
   *
   * @returns List of priorities
   */
  @Get('priorities')
  @ApiOperation({ summary: 'Obtener todas las prioridades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de prioridades',
    type: [Priority],
  })
  async findAllPriorities(): Promise<Priority[]> {
    return this.catalogsService.findAllPriorities();
  }

  @Post('priorities')
  @ApiOperation({ summary: 'Crear prioridad' })
  @ApiResponse({ status: 201, description: 'Prioridad creada', type: Priority })
  async createPriority(@Body() createDto: CreateCatalogDto): Promise<Priority> {
    return this.catalogsService.createPriority(createDto);
  }

  @Put('priorities/:id')
  @ApiOperation({ summary: 'Actualizar prioridad' })
  @ApiResponse({ status: 200, description: 'Prioridad actualizada', type: Priority })
  async updatePriority(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCatalogDto,
  ): Promise<Priority> {
    return this.catalogsService.updatePriority(id, updateDto);
  }

  @Delete('priorities/:id')
  @ApiOperation({ summary: 'Eliminar prioridad' })
  @ApiResponse({ status: 200, description: 'Prioridad eliminada' })
  async deletePriority(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deletePriority(id);
  }

  @Get('statuses')
  @ApiOperation({ summary: 'Obtener todos los estados (LifecycleStatus)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados del ciclo de vida',
    type: [LifecycleStatus],
  })
  async findAllStatuses(): Promise<LifecycleStatus[]> {
    return this.catalogsService.findAllStatuses();
  }

  @Post('statuses')
  @ApiOperation({ summary: 'Crear estado' })
  @ApiResponse({ status: 201, description: 'Estado creado', type: LifecycleStatus })
  async createStatus(@Body() createDto: CreateCatalogDto): Promise<LifecycleStatus> {
    return this.catalogsService.createStatus(createDto);
  }

  @Put('statuses/:id')
  @ApiOperation({ summary: 'Actualizar estado' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: LifecycleStatus })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCatalogDto,
  ): Promise<LifecycleStatus> {
    return this.catalogsService.updateStatus(id, updateDto);
  }

  @Delete('statuses/:id')
  @ApiOperation({ summary: 'Eliminar estado' })
  @ApiResponse({ status: 200, description: 'Estado eliminado' })
  async deleteStatus(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deleteStatus(id);
  }

  @Get('risk-levels')
  @ApiOperation({ summary: 'Obtener todos los niveles de riesgo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de niveles de riesgo',
    type: [RiskLevel],
  })
  async findAllRiskLevels(): Promise<RiskLevel[]> {
    return this.catalogsService.findAllRiskLevels();
  }

  @Post('risk-levels')
  @ApiOperation({ summary: 'Crear nivel de riesgo' })
  @ApiResponse({ status: 201, description: 'Nivel de riesgo creado', type: RiskLevel })
  async createRiskLevel(@Body() createDto: CreateCatalogDto): Promise<RiskLevel> {
    return this.catalogsService.createRiskLevel(createDto);
  }

  @Put('risk-levels/:id')
  @ApiOperation({ summary: 'Actualizar nivel de riesgo' })
  @ApiResponse({ status: 200, description: 'Nivel de riesgo actualizado', type: RiskLevel })
  async updateRiskLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCatalogDto,
  ): Promise<RiskLevel> {
    return this.catalogsService.updateRiskLevel(id, updateDto);
  }

  @Delete('risk-levels/:id')
  @ApiOperation({ summary: 'Eliminar nivel de riesgo' })
  @ApiResponse({ status: 200, description: 'Nivel de riesgo eliminado' })
  async deleteRiskLevel(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deleteRiskLevel(id);
  }

  @Get('complexities')
  @ApiOperation({ summary: 'Obtener todas las complejidades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de complejidades',
    type: [Complexity],
  })
  async findAllComplexities(): Promise<Complexity[]> {
    return this.catalogsService.findAllComplexities();
  }

  @Post('complexities')
  @ApiOperation({ summary: 'Crear complejidad' })
  @ApiResponse({ status: 201, description: 'Complejidad creada', type: Complexity })
  async createComplexity(@Body() createDto: CreateCatalogDto): Promise<Complexity> {
    return this.catalogsService.createComplexity(createDto);
  }

  @Put('complexities/:id')
  @ApiOperation({ summary: 'Actualizar complejidad' })
  @ApiResponse({ status: 200, description: 'Complejidad actualizada', type: Complexity })
  async updateComplexity(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCatalogDto,
  ): Promise<Complexity> {
    return this.catalogsService.updateComplexity(id, updateDto);
  }

  @Delete('complexities/:id')
  @ApiOperation({ summary: 'Eliminar complejidad' })
  @ApiResponse({ status: 200, description: 'Complejidad eliminada' })
  async deleteComplexity(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deleteComplexity(id);
  }

  @Get('effort-estimate-types')
  @ApiOperation({ summary: 'Obtener todos los tipos de esfuerzo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de esfuerzo',
    type: [EffortEstimateType],
  })
  async findAllEffortTypes(): Promise<EffortEstimateType[]> {
    return this.catalogsService.findAllEffortEstimateTypes();
  }

  @Get('requirement-types')
  @ApiOperation({ summary: 'Obtener todos los tipos de requerimiento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de requerimiento',
    type: [RequirementType],
  })
  async findAllTypes(): Promise<RequirementType[]> {
    return this.catalogsService.findAllRequirementTypes();
  }

  @Post('requirement-types')
  @ApiOperation({ summary: 'Crear tipo de requerimiento' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de requerimiento creado',
    type: RequirementType,
  })
  async createType(@Body() type: Partial<RequirementType>): Promise<RequirementType> {
    return this.catalogsService.createRequirementType(type);
  }

  @Put('requirement-types/:id')
  @ApiOperation({ summary: 'Actualizar tipo de requerimiento' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de requerimiento actualizado',
    type: RequirementType,
  })
  async updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() type: Partial<RequirementType>,
  ): Promise<RequirementType> {
    return this.catalogsService.updateRequirementType(id, type);
  }

  @Delete('requirement-types/:id')
  @ApiOperation({ summary: 'Eliminar tipo de requerimiento' })
  @ApiResponse({ status: 200, description: 'Tipo de requerimiento eliminado' })
  async deleteType(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deleteRequirementType(id);
  }

  @Get('verification-methods')
  @ApiOperation({ summary: 'Obtener todos los métodos de verificación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de métodos de verificación',
    type: [VerificationMethod],
  })
  async findAllVerificationMethods(): Promise<VerificationMethod[]> {
    return this.catalogsService.findAllVerificationMethods();
  }

  @Post('verification-methods')
  @ApiOperation({ summary: 'Crear método de verificación' })
  @ApiResponse({
    status: 201,
    description: 'Método de verificación creado',
    type: VerificationMethod,
  })
  async createVerificationMethod(@Body() createDto: CreateCatalogDto): Promise<VerificationMethod> {
    return this.catalogsService.createVerificationMethod(createDto);
  }

  @Put('verification-methods/:id')
  @ApiOperation({ summary: 'Actualizar método de verificación' })
  @ApiResponse({
    status: 200,
    description: 'Método de verificación actualizado',
    type: VerificationMethod,
  })
  async updateVerificationMethod(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCatalogDto,
  ): Promise<VerificationMethod> {
    return this.catalogsService.updateVerificationMethod(id, updateDto);
  }

  @Delete('verification-methods/:id')
  @ApiOperation({ summary: 'Eliminar método de verificación' })
  @ApiResponse({ status: 200, description: 'Método de verificación eliminado' })
  async deleteVerificationMethod(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deleteVerificationMethod(id);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Obtener todas las métricas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de métricas',
    type: [Metric],
  })
  async findAllMetrics(): Promise<Metric[]> {
    return this.catalogsService.findAllMetrics();
  }

  @Post('metrics')
  @ApiOperation({ summary: 'Crear métrica' })
  @ApiResponse({ status: 201, description: 'Métrica creada', type: Metric })
  async createMetric(@Body() createDto: CreateMetricDto): Promise<Metric> {
    return this.catalogsService.createMetric(createDto);
  }

  @Put('metrics/:id')
  @ApiOperation({ summary: 'Actualizar métrica' })
  @ApiResponse({ status: 200, description: 'Métrica actualizada', type: Metric })
  async updateMetric(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMetricDto,
  ): Promise<Metric> {
    return this.catalogsService.updateMetric(id, updateDto);
  }

  async deleteMetric(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.catalogsService.deleteMetric(id);
  }

  @Get('product-owners')
  @ApiOperation({ summary: 'Obtener todos los Product Owners' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Product Owners',
    type: [ProductOwner],
  })
  async findAllProductOwners(): Promise<ProductOwner[]> {
    return this.catalogsService.findAllProductOwners();
  }

  @Post('product-owners')
  @ApiOperation({ summary: 'Crear Product Owner' })
  @ApiResponse({ status: 201, description: 'Product Owner creado', type: ProductOwner })
  async createProductOwner(@Body() createDto: CreateProductOwnerDto): Promise<ProductOwner> {
    return this.catalogsService.createProductOwner(createDto);
  }

  @Put('product-owners/:id')
  @ApiOperation({ summary: 'Actualizar Product Owner' })
  @ApiResponse({ status: 200, description: 'Product Owner actualizado', type: ProductOwner })
  async updateProductOwner(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductOwnerDto,
  ): Promise<ProductOwner> {
    return this.catalogsService.updateProductOwner(id, updateDto);
  }

  @Delete('product-owners/:id')
  @ApiOperation({ summary: 'Eliminar Product Owner' })
  @ApiResponse({ status: 200, description: 'Product Owner eliminado' })
  async deleteProductOwner(@Param('id') id: string): Promise<void> {
    return this.catalogsService.deleteProductOwner(id);
  }

  @Get('approvers')
  @ApiOperation({ summary: 'Obtener todos los Approvers' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Approvers',
    type: [Approver],
  })
  async findAllApprovers(): Promise<Approver[]> {
    return this.catalogsService.findAllApprovers();
  }

  @Post('approvers')
  @ApiOperation({ summary: 'Crear Approver' })
  @ApiResponse({ status: 201, description: 'Approver creado', type: Approver })
  async createApprover(@Body() createDto: CreateApproverDto): Promise<Approver> {
    return this.catalogsService.createApprover(createDto);
  }

  @Put('approvers/:id')
  @ApiOperation({ summary: 'Actualizar Approver' })
  @ApiResponse({ status: 200, description: 'Approver actualizado', type: Approver })
  async updateApprover(
    @Param('id') id: string,
    @Body() updateDto: UpdateApproverDto,
  ): Promise<Approver> {
    return this.catalogsService.updateApprover(id, updateDto);
  }

  @Delete('approvers/:id')
  @ApiOperation({ summary: 'Eliminar Approver' })
  @ApiResponse({ status: 200, description: 'Approver eliminado' })
  async deleteApprover(@Param('id') id: string): Promise<void> {
    return this.catalogsService.deleteApprover(id);
  }
}
