import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PortfoliosService } from '@application/portfolios/services/portfolios.service';
import { Portfolio } from '@domain/entities/portfolio.entity';
import { CreatePortfolioDto } from '@application/portfolios/dtos/create-portfolio.dto';
import { UpdatePortfolioDto } from '@application/portfolios/dtos/update-portfolio.dto';

@ApiTags('portfolios')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'portfolios', version: '1' })
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los portafolios' })
  @ApiResponse({ status: 200, description: 'Lista de portafolios' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.portfoliosService.findAll({
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
      sortBy,
      sortOrder
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener portafolio por ID' })
  @ApiResponse({ status: 200, description: 'Portafolio encontrado', type: Portfolio })
  @ApiResponse({ status: 404, description: 'Portafolio no encontrado' })
  async findOne(@Param('id') id: string): Promise<Portfolio> {
    return this.portfoliosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo portafolio' })
  @ApiResponse({ status: 201, description: 'Portafolio creado', type: Portfolio })
  async create(@Body() createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    return this.portfoliosService.create(createPortfolioDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar portafolio' })
  @ApiResponse({ status: 200, description: 'Portafolio actualizado', type: Portfolio })
  async update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    return this.portfoliosService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar portafolio' })
  @ApiResponse({ status: 204, description: 'Portafolio eliminado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.portfoliosService.remove(id);
  }
}
