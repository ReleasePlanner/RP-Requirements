import { PartialType } from '@nestjs/swagger';
import { CreateSponsorDto } from './create-sponsor.dto';

/**
 * DTO for updating a sponsor
 *
 * All fields are optional as this extends PartialType of CreateSponsorDto
 */
export class UpdateSponsorDto extends PartialType(CreateSponsorDto) {}
