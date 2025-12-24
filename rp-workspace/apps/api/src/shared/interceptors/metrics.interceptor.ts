import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService, RequestMetrics, ErrorMetrics } from '../services/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, route } = request;
    
    // Get endpoint path (use route.path if available, otherwise parse from url)
    const endpoint = route?.path || url.split('?')[0];
    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        const metric: RequestMetrics = {
          method,
          endpoint,
          statusCode,
          responseTime,
          timestamp: new Date(),
        };

        this.metricsService.recordRequest(metric);
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Record request even if it failed
        const metric: RequestMetrics = {
          method,
          endpoint,
          statusCode,
          responseTime,
          timestamp: new Date(),
        };
        this.metricsService.recordRequest(metric);

        // Record error
        const errorMetric: ErrorMetrics = {
          errorType: error.constructor?.name || 'Error',
          message: error.message || 'Unknown error',
          endpoint,
          method,
          timestamp: new Date(),
          stack: error.stack,
        };
        this.metricsService.recordError(errorMetric);

        throw error;
      }),
    );
  }
}

