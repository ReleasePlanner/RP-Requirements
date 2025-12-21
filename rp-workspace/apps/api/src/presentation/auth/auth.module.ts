import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsor } from '@domain/entities/sponsor.entity';
import { AuthController } from './auth.controller';
import { AuthService } from '@application/auth/services/auth.service';
import { SponsorRepository } from '@infrastructure/repositories/sponsor.repository';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';
import { JwtStrategy } from '@infrastructure/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Sponsor]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'ISponsorRepository',
      useClass: SponsorRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, 'ISponsorRepository'],
})
export class AuthModule { }
