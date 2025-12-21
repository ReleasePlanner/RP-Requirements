import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class RequirementResponseDto {
  @ApiProperty({ description: 'ID del requisito', example: 'uuid' })
  @Expose()
  requirementId: string;

  @ApiProperty({ description: 'Título del requisito' })
  @Expose()
  title: string;

  @ApiPropertyOptional({ description: 'Declaración de la historia' })
  @Expose()
  storyStatement?: string;

  @ApiPropertyOptional({ description: 'Criterios de aceptación' })
  @Expose()
  acceptanceCriteria?: string;

  @ApiPropertyOptional({ description: 'Estimación de esfuerzo' })
  @Expose()
  effortEstimate?: number;

  @ApiPropertyOptional({ description: 'Valor de negocio' })
  @Expose()
  businessValue?: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  creationDate: Date;

  @ApiPropertyOptional({ description: 'Fecha de Go-Live' })
  @Expose()
  goLiveDate?: Date;

  @ApiPropertyOptional({ description: 'Prioridad' })
  @Expose()
  @Type(() => Object)
  priority?: { priorityId: number; name: string };

  @ApiPropertyOptional({ description: 'Estado' })
  @Expose()
  @Type(() => Object)
  status?: { statusId: number; name: string };

  @ApiPropertyOptional({ description: 'Tipo' })
  @Expose()
  @Type(() => Object)
  type?: { typeId: number; name: string };

  @ApiPropertyOptional({ description: 'Complejidad' })
  @Expose()
  @Type(() => Object)
  complexity?: { complexityId: number; name: string };

  @ApiPropertyOptional({ description: 'Fuente' })
  @Expose()
  @Type(() => Object)
  source?: { sourceId: number; name: string };

  @ApiPropertyOptional({ description: 'Propietario' })
  @Expose()
  @Type(() => Object)
  owner?: { userId: string; name: string; email: string };

  @ApiPropertyOptional({ description: 'Épico' })
  @Expose()
  @Type(() => Object)
  epic?: { epicId: string; name: string };

  constructor(partial: Partial<RequirementResponseDto>) {
    Object.assign(this, partial);
  }
}
