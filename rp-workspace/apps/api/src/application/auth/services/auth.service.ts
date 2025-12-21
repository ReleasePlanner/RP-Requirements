import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ISponsorRepository')
    private readonly sponsorRepository: ISponsorRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
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

    const { password: _, ...result } = sponsor;
    return result;
  }

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
      expiresIn: this.parseExpiresIn(expiresIn),
      user: {
        userId: sponsor.sponsorId, // Maintain DTO compatibility if DTO is not renamed yet, or update DTO
        name: sponsor.name,
        email: sponsor.email,
        role: sponsor.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check if sponsor already exists
    const existingSponsor = await this.sponsorRepository.findByEmail(registerDto.email);
    if (existingSponsor) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Create sponsor
    const sponsor = await this.sponsorRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || 'User', // Role 'User' might still be used or 'Sponsor'
      isActive: true,
    });

    // Generate token
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
      expiresIn: this.parseExpiresIn(expiresIn),
      user: {
        userId: sponsor.sponsorId,
        name: sponsor.name,
        email: sponsor.email,
        role: sponsor.role,
      },
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 86400; // Default 1 day
    }
  }
}
