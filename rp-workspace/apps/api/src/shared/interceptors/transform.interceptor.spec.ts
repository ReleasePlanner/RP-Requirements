import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<any>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();
    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as any;
  });

  describe('intercept', () => {
    it('should transform response with metadata', (done) => {
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('data');
          expect(result).toHaveProperty('statusCode', 200);
          expect(result).toHaveProperty('message', 'Success');
          expect(result).toHaveProperty('timestamp');
          done();
        },
      });
    });
  });
});
