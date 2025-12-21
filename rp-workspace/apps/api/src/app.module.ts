import { Module } from '@nestjs/common';
// Trigger rebuild
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { configValidationSchema } from './shared/config/config.validation';
import { databaseConfig } from './infrastructure/database/database.config';
import { AuthModule } from './presentation/auth/auth.module';
import { SponsorsModule } from './presentation/sponsors/sponsors.module';
import { RequirementsModule } from './presentation/requirements/requirements.module';
import { PortfoliosModule } from './presentation/portfolios/portfolios.module';
import { CatalogsModule } from './presentation/catalogs/catalogs.module';
import { EpicsModule } from './presentation/epics/epics.module';
import { InitiativesModule } from './presentation/initiatives/initiatives.module';
import { HealthModule } from './presentation/health/health.module';
import { WidgetsModule } from './application/widgets/widgets.module';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),

    // Database Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate Limiting (OWASP: Rate Limiting)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
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

    // Logging
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        level: configService.get<string>('LOG_LEVEL', 'info'),
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json(),
        ),
        defaultMeta: { service: 'requirements-api' },
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
                return `${timestamp} [${context}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
              }),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    SponsorsModule,
    RequirementsModule,
    PortfoliosModule,
    CatalogsModule,
    EpicsModule,
    InitiativesModule,
    HealthModule,
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
export class AppModule { }
