import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceMonitorService } from './performance-monitor.service';
import { MetricsService } from './metrics.service';

describe('PerformanceMonitorService', () => {
  let service: PerformanceMonitorService;
  let metricsService: jest.Mocked<MetricsService>;

  beforeEach(async () => {
    const mockMetricsService = {
      recordPerformance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerformanceMonitorService,
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    service = module.get<PerformanceMonitorService>(PerformanceMonitorService);
    metricsService = module.get(MetricsService) as jest.Mocked<MetricsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should start monitoring and log message', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'log');
      
      service.onModuleInit();

      expect(metricsService.recordPerformance).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith('Performance monitoring started');
      loggerSpy.mockRestore();
    });

    it('should call recordPerformance on init', () => {
      service.onModuleInit();
      expect(metricsService.recordPerformance).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should stop monitoring and log message', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'log');
      
      service.onModuleDestroy();

      expect(loggerSpy).toHaveBeenCalledWith('Performance monitoring stopped');
      loggerSpy.mockRestore();
    });

    it('should clear monitoring interval if set', () => {
      // Set an interval to test clearing
      service['monitoringInterval'] = setInterval(() => {}, 1000);
      
      service.onModuleDestroy();

      expect(service['monitoringInterval']).toBeNull();
    });
  });

  describe('collectPerformanceMetrics', () => {
    it('should record performance metrics', () => {
      service.collectPerformanceMetrics();
      expect(metricsService.recordPerformance).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      metricsService.recordPerformance.mockImplementation(() => {
        throw new Error('Test error');
      });

      service.collectPerformanceMetrics();

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error collecting performance metrics'),
      );
      loggerSpy.mockRestore();
    });
  });

  describe('getSystemResources', () => {
    it('should return system resource information', () => {
      const resources = service.getSystemResources();

      expect(resources).toBeDefined();
      expect(resources.memory).toBeDefined();
      expect(resources.memory.rss).toBeGreaterThanOrEqual(0);
      expect(resources.memory.heapTotal).toBeGreaterThanOrEqual(0);
      expect(resources.memory.heapUsed).toBeGreaterThanOrEqual(0);
      expect(resources.memory.external).toBeGreaterThanOrEqual(0);
      expect(resources.memory.arrayBuffers).toBeGreaterThanOrEqual(0);
      
      expect(resources.cpu).toBeDefined();
      expect(resources.cpu.user).toBeGreaterThanOrEqual(0);
      expect(resources.cpu.system).toBeGreaterThanOrEqual(0);
      
      expect(resources.uptime).toBeGreaterThanOrEqual(0);
      expect(resources.pid).toBeGreaterThan(0);
      expect(resources.platform).toBeDefined();
      expect(resources.nodeVersion).toBeDefined();
    });

    it('should return valid memory usage', () => {
      const resources = service.getSystemResources();
      expect(resources.memory.heapUsed).toBeLessThanOrEqual(resources.memory.heapTotal);
    });
  });

  describe('startMonitoring', () => {
    it('should record initial performance metrics', () => {
      service['startMonitoring']();
      expect(metricsService.recordPerformance).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopMonitoring', () => {
    it('should clear monitoring interval', () => {
      service['monitoringInterval'] = setInterval(() => {}, 1000);
      
      service['stopMonitoring']();

      expect(service['monitoringInterval']).toBeNull();
    });

    it('should handle null interval gracefully', () => {
      service['monitoringInterval'] = null;
      
      expect(() => {
        service['stopMonitoring']();
      }).not.toThrow();
    });
  });
});

