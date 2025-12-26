import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RequestUser } from '@shared/types';
import { parseDurationToSeconds } from '@shared/utils';

/**
 * Authentication Service
 *
 * Handles user authentication, registration, and JWT token generation
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject('ISponsorRepository')
    private readonly sponsorRepository: ISponsorRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates user credentials
   *
   * @param email - User email address
   * @param password - User password (plain text)
   * @returns User information without password
   * @throws UnauthorizedException if credentials are invalid or user is inactive
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<RequestUser, 'userId'> & { sponsorId: string }> {
    const sponsor = await this.sponsorRepository.findByEmail(email);
    if (!sponsor) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!sponsor.isActive) {
      throw new UnauthorizedException('Sponsor inactivo'); // Changed message
    }

    const isPasswordValid = await bcrypt.compare(password, sponsor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = sponsor;
    return result;
  }

  /**
   * Authenticates a user and returns a JWT token
   *
   * @param loginDto - User credentials (email and password)
   * @returns Authentication response with access token and user data
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const sponsor = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: sponsor.sponsorId,
      email: sponsor.email,
      role: sponsor.role,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: parseDurationToSeconds(expiresIn),
      user: {
        userId: sponsor.sponsorId,
        name: sponsor.name,
        email: sponsor.email,
        role: sponsor.role,
      },
    };
  }

  /**
   * Registers a new user and returns a JWT token
   *
   * @param registerDto - User registration data
   * @returns Authentication response with access token and user data
   * @throws ConflictException if email is already registered
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingSponsor = await this.sponsorRepository.findByEmail(registerDto.email);
    if (existingSponsor) {
      throw new ConflictException('El email ya está registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const sponsor = await this.sponsorRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || 'User',
      isActive: true,
    });

    const payload = {
      sub: sponsor.sponsorId,
      email: sponsor.email,
      role: sponsor.role,
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1d');
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: parseDurationToSeconds(expiresIn),
      user: {
        userId: sponsor.sponsorId,
        name: sponsor.name,
        email: sponsor.email,
        role: sponsor.role,
      },
    };
  }
}
