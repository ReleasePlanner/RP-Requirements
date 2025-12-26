import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from '@application/catalogs/services/catalogs.service';
import { CatalogsRepository } from '@infrastructure/database/repositories/catalogs.repository';
import { Priority } from '@domain/entities/priority.entity';
import { LifecycleStatus } from '@domain/entities/lifecycle-status.entity';
import { RiskLevel } from '@domain/entities/risk-level.entity';
import { Complexity } from '@domain/entities/complexity.entity';
import { EffortEstimateType } from '@domain/entities/effort-estimate-type.entity';
import { RequirementType } from '@domain/entities/requirement-type.entity';
import { VerificationMethod } from '@domain/entities/verification-method.entity';
import { Metric } from '@domain/entities/metric.entity';
import { ProductOwner } from '@domain/entities/product-owner.entity';
import { Approver } from '@domain/entities/approver.entity';
import { Source } from '@domain/entities/source.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Priority,
      LifecycleStatus,
      RiskLevel,
      Complexity,
      EffortEstimateType,
      RequirementType,
      VerificationMethod,
      Metric,
      ProductOwner,
      Approver,
      Source,
    ]),
  ],
  controllers: [CatalogsController],
  providers: [
    CatalogsService,
    {
      provide: 'ICatalogsRepository',
      useClass: CatalogsRepository,
    },
  ],
  exports: [CatalogsService],
})
export class CatalogsModule {}
