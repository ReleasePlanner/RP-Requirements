import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          body: { password: 'secret', token: 'token123' },
          query: { filter: 'value' },
          params: { id: '123' },
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as any;
  });

  describe('intercept', () => {
    it('should log request and response', (done) => {
      const loggerSpy = jest.spyOn(interceptor['logger'], 'log');

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          expect(loggerSpy).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should sanitize sensitive data in logs', (done) => {
      const logSpy = jest.spyOn(interceptor['logger'], 'log');

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          expect(logSpy).toHaveBeenCalled();
          const logCalls = logSpy.mock.calls;
          if (logCalls.length > 0) {
            const logMessage = logCalls[0][0] as string;
            expect(logMessage).not.toContain('secret');
            expect(logMessage).not.toContain('token123');
            expect(logMessage).toContain('***REDACTED***');
          }
          done();
        },
      });
    });

    it('should log errors', (done) => {
      const error = new Error('Test error');
      mockCallHandler.handle.mockReturnValue(throwError(() => error));
      const loggerErrorSpy = jest.spyOn(interceptor['logger'], 'error');

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: () => {
          expect(loggerErrorSpy).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle request without body', (done) => {
      mockExecutionContext.switchToHttp.mockReturnValue({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          query: {},
          params: {},
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      } as any);

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: () => {
          expect(mockCallHandler.handle).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('sanitizeBody', () => {
    it('should sanitize password field', () => {
      const body = { password: 'secret123', username: 'user' };
      const sanitized = interceptor['sanitizeBody'](body);

      expect(sanitized.password).toBe('***REDACTED***');
      expect(sanitized.username).toBe('user');
    });

    it('should sanitize token field', () => {
      const body = { token: 'token123', data: 'value' };
      const sanitized = interceptor['sanitizeBody'](body);

      expect(sanitized.token).toBe('***REDACTED***');
      expect(sanitized.data).toBe('value');
    });

    it('should sanitize secret field', () => {
      const body = { secret: 'secret123', public: 'public' };
      const sanitized = interceptor['sanitizeBody'](body);

      expect(sanitized.secret).toBe('***REDACTED***');
      expect(sanitized.public).toBe('public');
    });

    it('should sanitize authorization field', () => {
      const body = { authorization: 'Bearer token', data: 'value' };
      const sanitized = interceptor['sanitizeBody'](body);

      expect(sanitized.authorization).toBe('***REDACTED***');
      expect(sanitized.data).toBe('value');
    });

    it('should handle null body', () => {
      const sanitized = interceptor['sanitizeBody'](null);

      expect(sanitized).toBeNull();
    });

    it('should handle undefined body', () => {
      const sanitized = interceptor['sanitizeBody'](undefined);

      expect(sanitized).toBeUndefined();
    });
  });
});
