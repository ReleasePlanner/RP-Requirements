import { IsString, IsOptional, MaxLength, IsNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInitiativeDto {
  @ApiProperty({ description: 'The title of the initiative', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'The strategic goal' })
  @IsOptional()
  @IsString()
  strategicGoal?: string;

  @ApiPropertyOptional({ description: 'Estimated business benefit' })
  @IsOptional()
  @IsNumber()
  estimatedBusinessBenefit?: number;

  @ApiPropertyOptional({ description: 'Estimated Cost' })
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional({ description: 'Estimated ROI' })
  @IsOptional()
  @IsNumber()
  estimatedROI?: number;

  @ApiPropertyOptional({ description: 'Date proposed' })
  @IsOptional()
  @IsDateString()
  dateProposed?: Date;

  @ApiPropertyOptional({ description: 'Text-based Status', required: false })
  @IsString()
  @IsOptional()
  status_text?: string;

  @ApiPropertyOptional({ description: 'The associated portfolio ID', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  portfolioId?: string;

  @ApiPropertyOptional({ description: 'Status ID (LifecycleStatus)' })
  @IsOptional()
  @IsNumber()
  statusId?: number;
}
