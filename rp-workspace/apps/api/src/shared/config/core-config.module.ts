import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { configValidationSchema } from './config.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
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
            filename: process.env.LOG_DIR ? `${process.env.LOG_DIR}/error.log` : 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: process.env.LOG_DIR
              ? `${process.env.LOG_DIR}/combined.log`
              : 'logs/combined.log',
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, WinstonModule],
})
export class CoreConfigModule {}
