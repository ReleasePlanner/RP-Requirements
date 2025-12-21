import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(reflector);
  });

  describe('canActivate', () => {
    it('should allow access and set mock user (Mock Mode)', () => {
      const mockRequest = {};
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect((mockRequest as any).user).toBeDefined();
      expect((mockRequest as any).user.userId).toBe('mock-sys-admin');
    });
  });
});
