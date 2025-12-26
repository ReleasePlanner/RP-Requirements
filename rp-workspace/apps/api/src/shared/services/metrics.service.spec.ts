import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService, RequestMetrics, ErrorMetrics, PerformanceMetrics } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
    service.clearMetrics(); // Clear metrics before each test
  });

  afterEach(() => {
    service.clearMetrics();
  });

  describe('recordRequest', () => {
    it('should record a request metric', () => {
      const metric: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      service.recordRequest(metric);

      const stats = service.getRequestStats();
      expect(stats.total).toBe(1);
      expect(stats.byEndpoint['GET:/api/test']).toBeDefined();
      expect(stats.byEndpoint['GET:/api/test'].count).toBe(1);
    });

    it('should update counters for the same endpoint', () => {
      const metric1: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      const metric2: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 200,
        timestamp: new Date(),
      };

      service.recordRequest(metric1);
      service.recordRequest(metric2);

      const stats = service.getRequestStats();
      expect(stats.total).toBe(2);
      expect(stats.byEndpoint['GET:/api/test'].count).toBe(2);
    });

    it('should log slow requests (responseTime > 1000ms)', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'warn');
      const metric: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/slow',
        statusCode: 200,
        responseTime: 1500,
        timestamp: new Date(),
      };

      service.recordRequest(metric);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Slow request detected'),
      );
      loggerSpy.mockRestore();
    });

    it('should limit metrics history to MAX_METRICS_HISTORY', () => {
      const maxHistory = service['MAX_METRICS_HISTORY'];
      
      // Create more metrics than the limit
      for (let i = 0; i < maxHistory + 50; i++) {
        const metric: RequestMetrics = {
          method: 'GET',
          endpoint: `/api/test${i}`,
          statusCode: 200,
          responseTime: 100,
          timestamp: new Date(),
        };
        service.recordRequest(metric);
      }

      const stats = service.getRequestStats();
      expect(stats.total).toBe(maxHistory);
    });
  });

  describe('recordError', () => {
    it('should record an error metric', () => {
      const error: ErrorMetrics = {
        errorType: 'BadRequestException',
        message: 'Invalid input',
        endpoint: '/api/test',
        method: 'POST',
        timestamp: new Date(),
      };

      service.recordError(error);

      const stats = service.getErrorStats();
      expect(stats.total).toBe(1);
      expect(stats.byType['BadRequestException']).toBe(1);
    });

    it('should log error when recording', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      const error: ErrorMetrics = {
        errorType: 'Error',
        message: 'Test error',
        endpoint: '/api/test',
        method: 'GET',
        timestamp: new Date(),
      };

      service.recordError(error);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error recorded'),
      );
      loggerSpy.mockRestore();
    });

    it('should limit error history to MAX_ERROR_HISTORY', () => {
      const maxHistory = service['MAX_ERROR_HISTORY'];
      
      for (let i = 0; i < maxHistory + 50; i++) {
        const error: ErrorMetrics = {
          errorType: 'Error',
          message: `Error ${i}`,
          endpoint: `/api/test${i}`,
          method: 'GET',
          timestamp: new Date(),
        };
        service.recordError(error);
      }

      const stats = service.getErrorStats();
      expect(stats.total).toBe(maxHistory);
    });
  });

  describe('recordPerformance', () => {
    it('should record performance metrics', () => {
      service.recordPerformance();

      const stats = service.getPerformanceStats();
      expect(stats.current).toBeDefined();
      expect(stats.current?.timestamp).toBeInstanceOf(Date);
    });

    it('should limit performance metrics history to 100', () => {
      for (let i = 0; i < 150; i++) {
        service.recordPerformance();
      }

      const stats = service.getPerformanceStats();
      expect(stats.current).toBeDefined();
      // The array should be limited to 100
      expect(service['performanceMetrics'].length).toBe(100);
    });
  });

  describe('getRequestStats', () => {
    it('should return correct request statistics', () => {
      const metric1: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test1',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      const metric2: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test1',
        statusCode: 200,
        responseTime: 200,
        timestamp: new Date(),
      };

      const metric3: RequestMetrics = {
        method: 'POST',
        endpoint: '/api/test2',
        statusCode: 400,
        responseTime: 50,
        timestamp: new Date(),
      };

      service.recordRequest(metric1);
      service.recordRequest(metric2);
      service.recordRequest(metric3);

      const stats = service.getRequestStats();

      expect(stats.total).toBe(3);
      expect(stats.byEndpoint['GET:/api/test1'].count).toBe(2);
      expect(stats.byEndpoint['GET:/api/test1'].avgResponseTime).toBe(150);
      expect(stats.byEndpoint['POST:/api/test2'].count).toBe(1);
      expect(stats.byEndpoint['POST:/api/test2'].errors).toBe(1);
      expect(stats.byStatusCode[200]).toBe(2);
      expect(stats.byStatusCode[400]).toBe(1);
      expect(stats.avgResponseTime).toBeCloseTo(116.67, 1);
    });

    it('should filter by time window', () => {
      const oldMetric: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/old',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(Date.now() - 2000), // 2 seconds ago
      };

      const newMetric: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/new',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      service.recordRequest(oldMetric);
      service.recordRequest(newMetric);

      const stats = service.getRequestStats(1000); // 1 second window

      expect(stats.total).toBe(1);
      expect(stats.byEndpoint['GET:/api/new']).toBeDefined();
      expect(stats.byEndpoint['GET:/api/old']).toBeUndefined();
    });

    it('should return zero avgResponseTime when no metrics', () => {
      const stats = service.getRequestStats();
      expect(stats.total).toBe(0);
      expect(stats.avgResponseTime).toBe(0);
    });
  });

  describe('getErrorStats', () => {
    it('should return correct error statistics', () => {
      const error1: ErrorMetrics = {
        errorType: 'BadRequestException',
        message: 'Error 1',
        endpoint: '/api/test1',
        method: 'GET',
        timestamp: new Date(),
      };

      const error2: ErrorMetrics = {
        errorType: 'BadRequestException',
        message: 'Error 2',
        endpoint: '/api/test2',
        method: 'POST',
        timestamp: new Date(),
      };

      const error3: ErrorMetrics = {
        errorType: 'NotFoundException',
        message: 'Not found',
        endpoint: '/api/test1',
        method: 'GET',
        timestamp: new Date(),
      };

      service.recordError(error1);
      service.recordError(error2);
      service.recordError(error3);

      const stats = service.getErrorStats();

      expect(stats.total).toBe(3);
      expect(stats.byType['BadRequestException']).toBe(2);
      expect(stats.byType['NotFoundException']).toBe(1);
      expect(stats.byEndpoint['GET:/api/test1']).toBe(2);
      expect(stats.byEndpoint['POST:/api/test2']).toBe(1);
      expect(stats.recent.length).toBe(3);
    });

    it('should filter by time window', () => {
      const oldError: ErrorMetrics = {
        errorType: 'Error',
        message: 'Old error',
        endpoint: '/api/old',
        method: 'GET',
        timestamp: new Date(Date.now() - 2000),
      };

      const newError: ErrorMetrics = {
        errorType: 'Error',
        message: 'New error',
        endpoint: '/api/new',
        method: 'GET',
        timestamp: new Date(),
      };

      service.recordError(oldError);
      service.recordError(newError);

      const stats = service.getErrorStats(1000);

      expect(stats.total).toBe(1);
      expect(stats.recent[0].endpoint).toBe('/api/new');
    });

    it('should return last 50 errors in recent', () => {
      for (let i = 0; i < 60; i++) {
        const error: ErrorMetrics = {
          errorType: 'Error',
          message: `Error ${i}`,
          endpoint: `/api/test${i}`,
          method: 'GET',
          timestamp: new Date(),
        };
        service.recordError(error);
      }

      const stats = service.getErrorStats();
      expect(stats.recent.length).toBe(50);
    });
  });

  describe('getPerformanceStats', () => {
    it('should return performance statistics', () => {
      service.recordPerformance();
      service.recordPerformance();

      const stats = service.getPerformanceStats();

      expect(stats.current).toBeDefined();
      expect(stats.average.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(stats.average.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(stats.max.memoryUsage).toBeGreaterThanOrEqual(0);
    });

    it('should return null current when no metrics', () => {
      const stats = service.getPerformanceStats();
      expect(stats.current).toBeNull();
      expect(stats.average.cpuUsage).toBe(0);
      expect(stats.average.memoryUsage).toBe(0);
    });
  });

  describe('getMetricsSummary', () => {
    it('should return complete metrics summary', () => {
      const metric: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      service.recordRequest(metric);
      service.recordPerformance();

      const summary = service.getMetricsSummary();

      expect(summary.requests).toBeDefined();
      expect(summary.errors).toBeDefined();
      expect(summary.performance).toBeDefined();
      expect(summary.uptime).toBeGreaterThanOrEqual(0);
    });

    it('should accept time window parameter', () => {
      const summary = service.getMetricsSummary(1000);
      expect(summary).toBeDefined();
    });
  });

  describe('clearMetrics', () => {
    it('should clear all metrics', () => {
      const metric: RequestMetrics = {
        method: 'GET',
        endpoint: '/api/test',
        statusCode: 200,
        responseTime: 100,
        timestamp: new Date(),
      };

      const error: ErrorMetrics = {
        errorType: 'Error',
        message: 'Test',
        endpoint: '/api/test',
        method: 'GET',
        timestamp: new Date(),
      };

      service.recordRequest(metric);
      service.recordError(error);
      service.recordPerformance();

      service.clearMetrics();

      expect(service.getRequestStats().total).toBe(0);
      expect(service.getErrorStats().total).toBe(0);
      expect(service.getPerformanceStats().current).toBeNull();
    });
  });
});

