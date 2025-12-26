import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

// Import all entities explicitly
import { Portfolio } from '../../domain/entities/portfolio.entity';
import { Sponsor } from '../../domain/entities/sponsor.entity';
import { Initiative } from '../../domain/entities/initiative.entity';
import { Epic } from '../../domain/entities/epic.entity';
import { Requirement } from '../../domain/entities/requirement.entity';
import { RequirementReference } from '../../domain/entities/requirement-reference.entity';
import { Priority } from '../../domain/entities/priority.entity';
import { LifecycleStatus } from '../../domain/entities/lifecycle-status.entity';
import { RiskLevel } from '../../domain/entities/risk-level.entity';
import { Complexity } from '../../domain/entities/complexity.entity';
import { EffortEstimateType } from '../../domain/entities/effort-estimate-type.entity';
import { RequirementType } from '../../domain/entities/requirement-type.entity';
import { VerificationMethod } from '../../domain/entities/verification-method.entity';
import { Metric } from '../../domain/entities/metric.entity';
import { ProductOwner } from '../../domain/entities/product-owner.entity';
import { Approver } from '../../domain/entities/approver.entity';
import { Source } from '../../domain/entities/source.entity';
import { Widget } from '../../domain/entities/widget.entity';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    // Import entities explicitly for better reliability
    entities: [
      Portfolio,
      Sponsor,
      Initiative,
      Epic,
      Requirement,
      RequirementReference,
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
      Widget,
    ],
    migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
    logging: configService.get<boolean>('DB_LOGGING', false),
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    extra: {
      max: 20, // Connection pool size
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    },
  };
};
