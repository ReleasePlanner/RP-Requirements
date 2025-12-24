import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@application/auth/services/auth.service';
import { LoginDto } from '@application/auth/dto/login.dto';
import { RegisterDto } from '@application/auth/dto/register.dto';
import { AuthResponseDto } from '@application/auth/dto/auth-response.dto';
import { Public } from '@shared/decorators/public.decorator';

/**
 * Authentication Controller
 * 
 * Handles user authentication endpoints including login, registration, and smoke tests
 */
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates a user and returns a JWT token
   * 
   * @param loginDto - User credentials (email and password)
   * @returns Authentication response with access token
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Registers a new user and returns a JWT token
   * 
   * @param registerDto - User registration data
   * @returns Authentication response with access token
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Smoke test endpoint for health checks
   * 
   * @returns Simple success response
   */
  @Public()
  @Get('admin/test')
  @ApiOperation({ summary: 'Smoke test endpoint' })
  @ApiResponse({ status: 200, description: 'Service is operational' })
  async test(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
