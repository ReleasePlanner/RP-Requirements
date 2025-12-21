import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';
import { Sponsor } from '@domain/entities/sponsor.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let sponsorRepository: jest.Mocked<ISponsorRepository>;
  let configService: jest.Mocked<ConfigService>;

  const mockSponsor: Sponsor = {
    sponsorId: 'sponsor-123',
    name: 'Test Sponsor',
    email: 'test@example.com',
    role: 'Sponsor',
    isActive: true,
  } as Sponsor;

  const mockPayload = {
    sub: 'sponsor-123',
    email: 'test@example.com',
    role: 'Sponsor',
  };

  beforeEach(async () => {
    const mockSponsorRepository = {
      findById: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('secret-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: 'ISponsorRepository',
          useValue: mockSponsorRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    sponsorRepository = module.get('ISponsorRepository') as jest.Mocked<ISponsorRepository>;
    configService = module.get(ConfigService);
  });

  describe('validate', () => {
    it('should return sponsor data when sponsor exists and is active', async () => {
      sponsorRepository.findById.mockResolvedValue(mockSponsor);

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        userId: mockSponsor.sponsorId,
        email: mockSponsor.email,
        role: mockSponsor.role,
      });
      expect(sponsorRepository.findById).toHaveBeenCalledWith(mockPayload.sub);
    });

    it('should throw UnauthorizedException when sponsor not found', async () => {
      sponsorRepository.findById.mockResolvedValue(null);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when sponsor is inactive', async () => {
      const inactiveSponsor = { ...mockSponsor, isActive: false };
      sponsorRepository.findById.mockResolvedValue(inactiveSponsor);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
