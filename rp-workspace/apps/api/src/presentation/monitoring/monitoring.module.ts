import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MetricsService } from '@shared/services/metrics.service';
import { MetricsInterceptor } from '@shared/interceptors/metrics.interceptor';
import { PerformanceMonitorService } from '@shared/services/performance-monitor.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  controllers: [MonitoringController],
  providers: [
    MetricsService,
    PerformanceMonitorService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [MetricsService, PerformanceMonitorService],
})
export class MonitoringModule {}

