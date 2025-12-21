import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { Public } from './shared/decorators/public.decorator';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'Requirements Management API is running';
  }
}
