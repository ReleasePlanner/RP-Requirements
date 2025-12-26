import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { databaseConfig } from './infrastructure/database/database.config';
import { CommonModule } from './shared/common.module';
import { AuthModule } from './presentation/auth/auth.module';
import { SponsorsModule } from './presentation/sponsors/sponsors.module';
import { RequirementsModule } from './presentation/requirements/requirements.module';
import { PortfoliosModule } from './presentation/portfolios/portfolios.module';
import { CatalogsModule } from './presentation/catalogs/catalogs.module';
import { EpicsModule } from './presentation/epics/epics.module';
import { InitiativesModule } from './presentation/initiatives/initiatives.module';
import { HealthModule } from './presentation/health/health.module';
import { MonitoringModule } from './presentation/monitoring/monitoring.module';
import { WidgetsModule } from './application/widgets/widgets.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { AppController } from './app.controller';

/**
 * Application Root Module
 *
 * Main module that imports all feature modules and configures global providers
 */
@Module({
  imports: [
    // Common Module (@app/common) - Shared code across the application
    CommonModule,

    // Database Module
    TypeOrmModule.forRootAsync({
      imports: [CommonModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate Limiting (OWASP: Rate Limiting)
    ThrottlerModule.forRootAsync({
      imports: [CommonModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: seconds(configService.get<number>('THROTTLE_TTL', 60)),
            limit: configService.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
      inject: [ConfigService],
    }),

    // Task Scheduling
    ScheduleModule.forRoot(),

    // Feature Modules
    AuthModule,
    SponsorsModule,
    RequirementsModule,
    PortfoliosModule,
    CatalogsModule,
    EpicsModule,
    InitiativesModule,
    HealthModule,
    MonitoringModule,
    WidgetsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
