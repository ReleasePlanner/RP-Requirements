import { Injectable, Logger } from '@nestjs/common';

export interface RequestMetrics {
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}

export interface ErrorMetrics {
  errorType: string;
  message: string;
  endpoint: string;
  method: string;
  timestamp: Date;
  stack?: string;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  heapUsed: number;
  heapTotal: number;
  timestamp: Date;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  // In-memory storage for metrics (in production, use Redis or time-series DB)
  private requestMetrics: RequestMetrics[] = [];
  private errorMetrics: ErrorMetrics[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];

  // Counters
  private requestCounts: Map<string, number> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private responseTimeSum: Map<string, number> = new Map();
  private responseTimeCount: Map<string, number> = new Map();

  // Configuration
  private readonly MAX_METRICS_HISTORY = 1000;
  private readonly MAX_ERROR_HISTORY = 500;

  /**
   * Record a request metric
   */
  recordRequest(metric: RequestMetrics): void {
    const key = `${metric.method}:${metric.endpoint}`;

    // Update counters
    this.requestCounts.set(key, (this.requestCounts.get(key) || 0) + 1);
    this.responseTimeSum.set(key, (this.responseTimeSum.get(key) || 0) + metric.responseTime);
    this.responseTimeCount.set(key, (this.responseTimeCount.get(key) || 0) + 1);

    // Store metric
    this.requestMetrics.push(metric);

    // Keep only recent metrics
    if (this.requestMetrics.length > this.MAX_METRICS_HISTORY) {
      this.requestMetrics.shift();
    }

    // Log slow requests
    if (metric.responseTime > 1000) {
      this.logger.warn(
        `Slow request detected: ${metric.method} ${metric.endpoint} took ${metric.responseTime}ms`,
      );
    }
  }

  /**
   * Record an error metric
   */
  recordError(error: ErrorMetrics): void {
    const key = `${error.method}:${error.endpoint}:${error.errorType}`;
    this.errorCounts.set(key, (this.errorCounts.get(key) || 0) + 1);

    this.errorMetrics.push(error);

    if (this.errorMetrics.length > this.MAX_ERROR_HISTORY) {
      this.errorMetrics.shift();
    }

    this.logger.error(
      `Error recorded: ${error.errorType} on ${error.method} ${error.endpoint} - ${error.message}`,
    );
  }

  /**
   * Record performance metrics
   */
  recordPerformance(): void {
    const usage = process.cpuUsage();
    const memUsage = process.memoryUsage();

    const metric: PerformanceMetrics = {
      cpuUsage: usage.user + usage.system,
      memoryUsage: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      timestamp: new Date(),
    };

    this.performanceMetrics.push(metric);

    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics.shift();
    }
  }

  /**
   * Get request statistics
   */
  getRequestStats(timeWindow?: number): {
    total: number;
    byEndpoint: Record<string, { count: number; avgResponseTime: number; errors: number }>;
    byStatusCode: Record<number, number>;
    avgResponseTime: number;
  } {
    const now = Date.now();
    const window = timeWindow ? now - timeWindow : 0;

    const filtered = this.requestMetrics.filter((m) => m.timestamp.getTime() >= window);

    const stats = {
      total: filtered.length,
      byEndpoint: {} as Record<string, { count: number; avgResponseTime: number; errors: number }>,
      byStatusCode: {} as Record<number, number>,
      avgResponseTime: 0,
    };

    filtered.forEach((metric) => {
      const key = `${metric.method}:${metric.endpoint}`;

      if (!stats.byEndpoint[key]) {
        stats.byEndpoint[key] = { count: 0, avgResponseTime: 0, errors: 0 };
      }

      stats.byEndpoint[key].count++;
      stats.byEndpoint[key].avgResponseTime += metric.responseTime;

      if (metric.statusCode >= 400) {
        stats.byEndpoint[key].errors++;
      }

      stats.byStatusCode[metric.statusCode] = (stats.byStatusCode[metric.statusCode] || 0) + 1;
    });

    // Calculate averages
    Object.keys(stats.byEndpoint).forEach((key) => {
      const endpoint = stats.byEndpoint[key];
      endpoint.avgResponseTime = endpoint.avgResponseTime / endpoint.count;
    });

    const totalResponseTime = filtered.reduce((sum, m) => sum + m.responseTime, 0);
    stats.avgResponseTime = filtered.length > 0 ? totalResponseTime / filtered.length : 0;

    return stats;
  }

  /**
   * Get error statistics
   */
  getErrorStats(timeWindow?: number): {
    total: number;
    byType: Record<string, number>;
    byEndpoint: Record<string, number>;
    recent: ErrorMetrics[];
  } {
    const now = Date.now();
    const window = timeWindow ? now - timeWindow : 0;

    const filtered = this.errorMetrics.filter((e) => e.timestamp.getTime() >= window);

    const stats = {
      total: filtered.length,
      byType: {} as Record<string, number>,
      byEndpoint: {} as Record<string, number>,
      recent: filtered.slice(-50), // Last 50 errors
    };

    filtered.forEach((error) => {
      stats.byType[error.errorType] = (stats.byType[error.errorType] || 0) + 1;
      const endpointKey = `${error.method}:${error.endpoint}`;
      stats.byEndpoint[endpointKey] = (stats.byEndpoint[endpointKey] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    current: PerformanceMetrics | null;
    average: {
      cpuUsage: number;
      memoryUsage: number;
      heapUsed: number;
      heapTotal: number;
    };
    max: {
      memoryUsage: number;
      heapUsed: number;
    };
  } {
    if (this.performanceMetrics.length === 0) {
      return {
        current: null,
        average: { cpuUsage: 0, memoryUsage: 0, heapUsed: 0, heapTotal: 0 },
        max: { memoryUsage: 0, heapUsed: 0 },
      };
    }

    const current = this.performanceMetrics[this.performanceMetrics.length - 1];

    const avg = this.performanceMetrics.reduce(
      (acc, m) => ({
        cpuUsage: acc.cpuUsage + m.cpuUsage,
        memoryUsage: acc.memoryUsage + m.memoryUsage,
        heapUsed: acc.heapUsed + m.heapUsed,
        heapTotal: acc.heapTotal + m.heapTotal,
      }),
      { cpuUsage: 0, memoryUsage: 0, heapUsed: 0, heapTotal: 0 },
    );

    const count = this.performanceMetrics.length;
    const average = {
      cpuUsage: avg.cpuUsage / count,
      memoryUsage: avg.memoryUsage / count,
      heapUsed: avg.heapUsed / count,
      heapTotal: avg.heapTotal / count,
    };

    const max = {
      memoryUsage: Math.max(...this.performanceMetrics.map((m) => m.memoryUsage)),
      heapUsed: Math.max(...this.performanceMetrics.map((m) => m.heapUsed)),
    };

    return { current, average, max };
  }

  /**
   * Get all metrics summary
   */
  getMetricsSummary(timeWindow?: number): {
    requests: ReturnType<typeof this.getRequestStats>;
    errors: ReturnType<typeof this.getErrorStats>;
    performance: ReturnType<typeof this.getPerformanceStats>;
    uptime: number;
  } {
    return {
      requests: this.getRequestStats(timeWindow),
      errors: this.getErrorStats(timeWindow),
      performance: this.getPerformanceStats(),
      uptime: process.uptime(),
    };
  }

  /**
   * Clear all metrics (useful for testing)
   */
  clearMetrics(): void {
    this.requestMetrics = [];
    this.errorMetrics = [];
    this.performanceMetrics = [];
    this.requestCounts.clear();
    this.errorCounts.clear();
    this.responseTimeSum.clear();
    this.responseTimeCount.clear();
  }
}
