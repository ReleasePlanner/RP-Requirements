import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { MetricsInterceptor } from './metrics.interceptor';
import { MetricsService } from '../services/metrics.service';

describe('MetricsInterceptor', () => {
  let interceptor: MetricsInterceptor;
  let metricsService: jest.Mocked<MetricsService>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(async () => {
    const mockMetricsService = {
      recordRequest: jest.fn(),
      recordError: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsInterceptor,
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    interceptor = module.get<MetricsInterceptor>(MetricsInterceptor);
    metricsService = module.get(MetricsService) as jest.Mocked<MetricsService>;

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          method: 'GET',
          url: '/api/test',
          route: { path: '/api/test' },
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should record request metrics on successful response', (done) => {
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          expect(metricsService.recordRequest).toHaveBeenCalledTimes(1);
          const recordedMetric = metricsService.recordRequest.mock.calls[0][0];
          expect(recordedMetric.method).toBe('GET');
          expect(recordedMetric.endpoint).toBe('/api/test');
          expect(recordedMetric.statusCode).toBe(200);
          expect(recordedMetric.responseTime).toBeGreaterThanOrEqual(0);
          expect(recordedMetric.timestamp).toBeInstanceOf(Date);
          done();
        },
      });
    });

    it('should use route.path when available', (done) => {
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => ({
          method: 'POST',
          url: '/api/test?query=value',
          route: { path: '/api/test' },
        }),
        getResponse: () => ({
          statusCode: 201,
        }),
      } as any);

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          const recordedMetric = metricsService.recordRequest.mock.calls[0][0];
          expect(recordedMetric.endpoint).toBe('/api/test');
          expect(recordedMetric.method).toBe('POST');
          expect(recordedMetric.statusCode).toBe(201);
          done();
        },
      });
    });

    it('should parse endpoint from url when route.path is not available', (done) => {
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => ({
          method: 'GET',
          url: '/api/test?query=value&other=param',
          route: null,
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      } as any);

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          const recordedMetric = metricsService.recordRequest.mock.calls[0][0];
          expect(recordedMetric.endpoint).toBe('/api/test');
          done();
        },
      });
    });

    it('should record request and error metrics on error', (done) => {
      const error = new Error('Test error');
      (error as any).status = 500;
      (error as any).constructor = { name: 'Error' };
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: () => {
          expect(metricsService.recordRequest).toHaveBeenCalledTimes(1);
          expect(metricsService.recordError).toHaveBeenCalledTimes(1);
          
          const recordedRequest = metricsService.recordRequest.mock.calls[0][0];
          expect(recordedRequest.statusCode).toBe(500);
          
          const recordedError = metricsService.recordError.mock.calls[0][0];
          expect(recordedError.errorType).toBe('Error');
          expect(recordedError.message).toBe('Test error');
          expect(recordedError.endpoint).toBe('/api/test');
          expect(recordedError.method).toBe('GET');
          expect(recordedError.timestamp).toBeInstanceOf(Date);
          done();
        },
      });
    });

    it('should use error.status or default to 500', (done) => {
      const error = new Error('Test error');
      (error as any).status = 404;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: () => {
          const recordedRequest = metricsService.recordRequest.mock.calls[0][0];
          expect(recordedRequest.statusCode).toBe(404);
          done();
        },
      });
    });

    it('should handle error without status code', (done) => {
      const error = new Error('Test error');
      delete (error as any).status;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: () => {
          const recordedRequest = metricsService.recordRequest.mock.calls[0][0];
          expect(recordedRequest.statusCode).toBe(500);
          done();
        },
      });
    });

    it('should handle error without constructor name', (done) => {
      const error = { message: 'Test error' } as Error;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: () => {
          const recordedError = metricsService.recordError.mock.calls[0][0];
          // When error doesn't have constructor.name, it defaults to 'Error'
          // But plain objects have constructor.name = 'Object', so it will be 'Object'
          expect(recordedError.errorType).toBe('Object');
          expect(recordedError.message).toBe('Test error');
          done();
        },
      });
    });

    it('should handle error without message', (done) => {
      const error = {} as Error;
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (err) => {
          expect(metricsService.recordError).toHaveBeenCalledTimes(1);
          const recordedError = metricsService.recordError.mock.calls[0][0];
          expect(recordedError.message).toBe('Unknown error');
          expect(err).toBe(error);
          done();
        },
      });
    });

    it('should include stack trace in error metrics when available', (done) => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';
      mockCallHandler.handle.mockReturnValue(throwError(() => error));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: () => {
          const recordedError = metricsService.recordError.mock.calls[0][0];
          expect(recordedError.stack).toBe(error.stack);
          done();
        },
      });
    });

    it('should measure response time correctly', (done) => {
      const startTime = Date.now();
      
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          const recordedMetric = metricsService.recordRequest.mock.calls[0][0];
          const endTime = Date.now();
          expect(recordedMetric.responseTime).toBeGreaterThanOrEqual(0);
          expect(recordedMetric.responseTime).toBeLessThanOrEqual(endTime - startTime + 100); // Allow some margin
          done();
        },
      });
    });
  });
});

