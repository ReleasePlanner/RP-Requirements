import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SponsorsService } from '@application/sponsors/services/sponsors.service';
import { Sponsor } from '@domain/entities/sponsor.entity';
import { CreateSponsorDto } from '@application/sponsors/dto/create-sponsor.dto';
import { UpdateSponsorDto } from '@application/sponsors/dto/update-sponsor.dto';

@ApiTags('sponsors')
@ApiBearerAuth('JWT-auth')
@Controller({ path: 'sponsors', version: '1' })
export class SponsorsController {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los sponsors' })
  @ApiResponse({ status: 200, description: 'Lista de sponsors', type: [Sponsor] })
  async findAll(): Promise<Sponsor[]> {
    return this.sponsorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sponsor por ID' })
  @ApiResponse({ status: 200, description: 'Sponsor encontrado', type: Sponsor })
  @ApiResponse({ status: 404, description: 'Sponsor no encontrado' })
  async findOne(@Param('id') id: string): Promise<Sponsor> {
    return this.sponsorsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo sponsor' })
  @ApiResponse({ status: 201, description: 'Sponsor creado', type: Sponsor })
  async create(@Body() createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    return this.sponsorsService.create(createSponsorDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar sponsor' })
  @ApiResponse({ status: 200, description: 'Sponsor actualizado', type: Sponsor })
  @ApiResponse({ status: 404, description: 'Sponsor no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
  ): Promise<Sponsor> {
    return this.sponsorsService.update(id, updateSponsorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar sponsor' })
  @ApiResponse({ status: 200, description: 'Sponsor eliminado' })
  @ApiResponse({ status: 404, description: 'Sponsor no encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.sponsorsService.delete(id);
  }
}
