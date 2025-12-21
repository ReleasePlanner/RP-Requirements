import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RequirementReferencesService } from '@application/requirements/services/requirement-references.service';
import { CreateRequirementReferenceDto } from '@application/requirements/dto/create-requirement-reference.dto';
import { UpdateRequirementReferenceDto } from '@application/requirements/dto/update-requirement-reference.dto';

@Controller('requirements/:requirementId/references')
export class RequirementReferencesController {
    constructor(private readonly service: RequirementReferencesService) { }

    @Post()
    create(
        @Param('requirementId', ParseUUIDPipe) requirementId: string,
        @Body() dto: CreateRequirementReferenceDto
    ) {
        return this.service.create({ ...dto, requirementId });
    }

    @Get()
    findByRequirement(@Param('requirementId', ParseUUIDPipe) requirementId: string) {
        return this.service.findByRequirementId(requirementId);
    }

    @Put(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateRequirementReferenceDto
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.delete(id);
    }
}
