import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requirement } from '@domain/entities/requirement.entity';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from '@application/requirements/services/requirements.service';
import { RequirementRepository } from '@infrastructure/repositories/requirement.repository';
import { RequirementReference } from '@domain/entities/requirement-reference.entity';
import { RequirementReferencesController } from './requirement-references.controller';
import { RequirementReferencesService } from '@application/requirements/services/requirement-references.service';
import { RequirementReferenceRepository } from '@infrastructure/repositories/requirement-reference.repository';
import { IRequirementRepository } from '@application/interfaces/repositories/requirement.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Requirement, RequirementReference])],
  controllers: [RequirementsController, RequirementReferencesController],
  providers: [
    RequirementsService,
    {
      provide: 'IRequirementRepository',
      useClass: RequirementRepository,
    },
    RequirementReferencesService,
    {
      provide: 'IRequirementReferenceRepository',
      useClass: RequirementReferenceRepository,
    },
  ],
  exports: [RequirementsService],
})
export class RequirementsModule { }
