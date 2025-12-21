import { RequestTimeoutException } from '@nestjs/common';
import { TimeoutInterceptor } from './timeout.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError, TimeoutError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('TimeoutInterceptor', () => {
  let interceptor: TimeoutInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    interceptor = new TimeoutInterceptor(1000);
    mockExecutionContext = {} as ExecutionContext;
    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  describe('intercept', () => {
    it('should return data within timeout', (done) => {
      mockCallHandler.handle.mockReturnValue(of({ data: 'test' }));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual({ data: 'test' });
          done();
        },
      });
    });

    it('should throw RequestTimeoutException on timeout', (done) => {
      mockCallHandler.handle.mockReturnValue(of({ data: 'test' }).pipe(delay(2000)));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RequestTimeoutException);
          done();
        },
      });
    });

    it('should propagate other errors', (done) => {
      const testError = new Error('Test error');
      mockCallHandler.handle.mockReturnValue(throwError(() => testError));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBe(testError);
          done();
        },
      });
    });
  });
});
