import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from '@shared/services/metrics.service';
import { PerformanceMonitorService } from '@shared/services/performance-monitor.service';
import { Public } from '@shared/decorators/public.decorator';

@ApiTags('monitoring')
@Controller({ path: 'monitoring', version: '1' })
export class MonitoringController {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly performanceMonitor: PerformanceMonitorService,
  ) {}

  @Public()
  @Get('metrics')
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  getMetrics(@Query('window') window?: string) {
    const timeWindow = window ? parseInt(window, 10) * 1000 : undefined; // Convert seconds to milliseconds
    return this.metricsService.getMetricsSummary(timeWindow);
  }

  @Public()
  @Get('metrics/requests')
  @ApiOperation({ summary: 'Get request metrics' })
  @ApiResponse({ status: 200, description: 'Request metrics retrieved successfully' })
  getRequestMetrics(@Query('window') window?: string) {
    const timeWindow = window ? parseInt(window, 10) * 1000 : undefined;
    return this.metricsService.getRequestStats(timeWindow);
  }

  @Public()
  @Get('metrics/errors')
  @ApiOperation({ summary: 'Get error metrics' })
  @ApiResponse({ status: 200, description: 'Error metrics retrieved successfully' })
  getErrorMetrics(@Query('window') window?: string) {
    const timeWindow = window ? parseInt(window, 10) * 1000 : undefined;
    return this.metricsService.getErrorStats(timeWindow);
  }

  @Public()
  @Get('metrics/performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance metrics retrieved successfully' })
  getPerformanceMetrics() {
    return this.metricsService.getPerformanceStats();
  }

  @Public()
  @Get('health/detailed')
  @ApiOperation({ summary: 'Get detailed health information' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  getDetailedHealth() {
    const metrics = this.metricsService.getMetricsSummary(300000); // Last 5 minutes
    const performance = this.metricsService.getPerformanceStats();
    const systemResources = this.performanceMonitor.getSystemResources();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      system: systemResources,
      memory: {
        used: performance.current?.memoryUsage || 0,
        heapUsed: performance.current?.heapUsed || 0,
        heapTotal: performance.current?.heapTotal || 0,
        max: performance.max,
        average: performance.average,
      },
      requests: {
        total: metrics.requests.total,
        avgResponseTime: metrics.requests.avgResponseTime,
        errorRate: metrics.errors.total / Math.max(metrics.requests.total, 1),
        byStatusCode: metrics.requests.byStatusCode,
      },
      errors: {
        total: metrics.errors.total,
        byType: metrics.errors.byType,
        recent: metrics.errors.recent.slice(-10),
      },
    };
  }

  @Public()
  @Get('system')
  @ApiOperation({ summary: 'Get system resources information' })
  @ApiResponse({ status: 200, description: 'System resources retrieved successfully' })
  getSystemResources() {
    return this.performanceMonitor.getSystemResources();
  }
}
