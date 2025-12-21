import { IsString, IsOptional, MaxLength, IsUUID, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEpicDto {
  @ApiProperty({ description: 'The name of the epic', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'The goal of the epic' })
  @IsOptional()
  @IsString()
  goal?: string;

  @ApiPropertyOptional({ description: 'Link to Business Case' })
  @IsOptional()
  @IsString()
  businessCaseLink?: string;

  @ApiPropertyOptional({ description: 'Actual Cost' })
  @IsOptional()
  @IsNumber()
  actualCost?: number;

  @ApiPropertyOptional({ description: 'The associated initiative ID', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  initiativeId?: string;

  @ApiPropertyOptional({ description: 'The start date of the epic' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'The end date of the epic' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Text-based Status', required: false })
  @IsString()
  @IsOptional()
  status_text?: string;

  @ApiPropertyOptional({ description: 'The status ID' })
  @IsOptional()
  @IsNumber()
  statusId?: number;
}
