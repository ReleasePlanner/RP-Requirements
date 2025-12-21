import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@shared/dto/pagination.dto';

export class RequirementQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID de épico',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  epicId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de estado',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  statusId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de prioridad',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priorityId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID del propietario',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
