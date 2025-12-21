import { PartialType } from '@nestjs/swagger';
import { CreateRequirementTypeDto } from './create-requirement-type.dto';

export class UpdateRequirementTypeDto extends PartialType(CreateRequirementTypeDto) { }
