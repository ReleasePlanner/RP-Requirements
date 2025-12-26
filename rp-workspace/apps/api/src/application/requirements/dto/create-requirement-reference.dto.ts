import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRequirementReferenceDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  referenceName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsOptional()
  requirementId: string;
}
