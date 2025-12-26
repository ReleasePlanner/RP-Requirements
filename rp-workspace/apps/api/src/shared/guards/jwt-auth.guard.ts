import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

/**
 * JWT Authentication Guard
 *
 * Protects routes by validating JWT tokens.
 * Currently configured as a mock guard that injects a mock user.
 *
 * @example
 * ```typescript
 * @UseGuards(JwtAuthGuard)
 * @Get('protected')
 * getProtectedData() {
 *   return { message: 'This is protected' };
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determines if the route can be activated
   *
   * @param context - Execution context containing request information
   * @returns True if route can be accessed, false otherwise
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // [MOCK-OVERRIDE] Per user request: "no manejar autorizacion por ahora es un mock"
    // We inject a mock user so controllers don't crash if they access req.user
    const request = context.switchToHttp().getRequest();
    request.user = {
      userId: 'mock-sys-admin',
      name: 'System Admin (Mock)',
      email: 'admin@example.com',
      role: 'Admin',
    };
    return true;

    /* Original Logic Disabled
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
    */
  }
}
