import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PerformanceMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PerformanceMonitorService.name);
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(private readonly metricsService: MetricsService) {}

  onModuleInit() {
    // Start collecting performance metrics every 30 seconds
    this.startMonitoring();
    this.logger.log('Performance monitoring started');
  }

  onModuleDestroy() {
    this.stopMonitoring();
    this.logger.log('Performance monitoring stopped');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  collectPerformanceMetrics() {
    try {
      this.metricsService.recordPerformance();
    } catch (error) {
      this.logger.error(`Error collecting performance metrics: ${error.message}`);
    }
  }

  private startMonitoring() {
    // Initial collection
    this.metricsService.recordPerformance();
  }

  private stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Get current system resource usage
   */
  getSystemResources() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: process.uptime(),
      pid: process.pid,
      platform: process.platform,
      nodeVersion: process.version,
    };
  }
}
