import { Global, Module } from '@nestjs/common';
import { CoreConfigModule } from './config/core-config.module';
import { NotificationsModule } from './notifications/notifications.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Common Module (@app/common)
 * 
 * Shared, reusable code across the application including:
 * - Configs: Global configuration settings
 * - Decorators: Custom decorators for reusability
 * - DTOs: Common data transfer objects
 * - Guards: Guards for role-based or permission-based access control
 * - Interceptors: Shared interceptors for request/response manipulation
 * - Notifications: Modules for handling app-wide notifications
 * - Services: Services that are reusable across modules
 * - Types: Common TypeScript types or interfaces
 * - Utils: Helper functions and utilities
 * - Validators: Custom validators for consistent input validation
 */
@Global()
@Module({
  imports: [CoreConfigModule, NotificationsModule],
  providers: [JwtAuthGuard],
  exports: [CoreConfigModule, NotificationsModule, JwtAuthGuard],
})
export class CommonModule {}

