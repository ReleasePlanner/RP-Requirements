import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ISponsorRepository')
    private readonly sponsorRepository: ISponsorRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const sponsor = await this.sponsorRepository.findById(payload.sub);
    if (!sponsor || !sponsor.isActive) {
      throw new UnauthorizedException('Sponsor no autorizado');
    }
    return {
      userId: sponsor.sponsorId, // Mapping sponsorId to userId for compatibility
      email: sponsor.email,
      role: sponsor.role,
    };
  }
}
