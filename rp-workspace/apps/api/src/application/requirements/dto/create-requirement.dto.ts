import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRequirementDto {
  @ApiProperty({ description: 'The title of the requirement' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'The story statement' })
  @IsOptional()
  @IsString()
  storyStatement?: string;

  @ApiPropertyOptional({ description: 'Acceptance criteria' })
  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @ApiPropertyOptional({ description: 'Effort estimate' })
  @IsOptional()
  @IsInt()
  effortEstimate?: number;

  @ApiPropertyOptional({ description: 'Actual effort' })
  @IsOptional()
  @IsInt()
  actualEffort?: number;

  @ApiPropertyOptional({ description: 'Business value' })
  @IsOptional()
  @IsNumber()
  businessValue?: number;

  @ApiPropertyOptional({ description: 'Link to change history' })
  @IsOptional()
  @IsString()
  changeHistoryLink?: string;

  @ApiPropertyOptional({ description: 'Owner Role' })
  @IsOptional()
  @IsString()
  ownerRole?: string;

  @ApiPropertyOptional({ description: 'Applicable Phase' })
  @IsOptional()
  @IsString()
  applicablePhase?: string;

  @ApiPropertyOptional({ description: 'Requirement Version' })
  @IsOptional()
  @IsString()
  requirementVersion?: string;

  @ApiPropertyOptional({ description: 'Is Mandatory' })
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @ApiPropertyOptional({ description: 'Go Live Date' })
  @IsOptional()
  @IsDateString()
  goLiveDate?: Date;

  @ApiPropertyOptional({ description: 'Requirement Status Date' })
  @IsOptional()
  @IsDateString()
  requirementStatusDate?: Date;

  @ApiPropertyOptional({ description: 'Text-based Status' })
  @IsOptional()
  @IsString()
  status_text?: string;

  // Foreign Keys
  @ApiPropertyOptional({ description: 'Priority ID' })
  @IsOptional()
  @IsInt()
  priorityId?: number;

  @ApiPropertyOptional({ description: 'Status ID (LifecycleStatus)' })
  @IsOptional()
  @IsInt()
  statusId?: number;

  @ApiPropertyOptional({ description: 'Type ID (RequirementType)' })
  @IsOptional()
  @IsInt()
  typeId?: number;

  @ApiPropertyOptional({ description: 'Complexity ID' })
  @IsOptional()
  @IsInt()
  complexityId?: number;

  @ApiPropertyOptional({ description: 'Source ID' })
  @IsOptional()
  @IsInt()
  sourceId?: number;

  @ApiPropertyOptional({ description: 'Effort Type ID' })
  @IsOptional()
  @IsInt()
  effortTypeId?: number;

  @ApiPropertyOptional({ description: 'Risk Level ID' })
  @IsOptional()
  @IsInt()
  riskLevelId?: number;

  @ApiPropertyOptional({ description: 'Metric ID' })
  @IsOptional()
  @IsInt()
  metricId?: number;

  @ApiPropertyOptional({ description: 'Verification Method ID' })
  @IsOptional()
  @IsInt()
  verificationMethodId?: number;

  @ApiPropertyOptional({ description: 'Epic ID' })
  @IsOptional()
  @IsUUID()
  epicId?: string;

  @ApiPropertyOptional({ description: 'Product Owner User ID' })
  @IsOptional()
  @IsUUID()
  productOwnerId?: string;

  @ApiPropertyOptional({ description: 'Approver User ID' })
  @IsOptional()
  @IsUUID()
  approverUserId?: string;
}
