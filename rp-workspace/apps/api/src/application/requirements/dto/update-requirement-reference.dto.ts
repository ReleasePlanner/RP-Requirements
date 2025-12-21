import { PartialType } from '@nestjs/mapped-types';
import { CreateRequirementReferenceDto } from './create-requirement-reference.dto';

export class UpdateRequirementReferenceDto extends PartialType(CreateRequirementReferenceDto) { }
