import { Test, TestingModule } from '@nestjs/testing';
import { SponsorsService } from './sponsors.service';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';
import { SponsorNotFoundException } from '@shared/exceptions/entity-not-found.exception';
import { Sponsor } from '@domain/entities/sponsor.entity';

describe('SponsorsService', () => {
  let service: SponsorsService;
  let repository: jest.Mocked<ISponsorRepository>;

  const mockSponsor: Sponsor = {
    sponsorId: 'sponsor-123',
    name: 'Test Sponsor',
    email: 'test@example.com',
    role: 'Sponsor',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sponsor;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SponsorsService,
        {
          provide: 'ISponsorRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SponsorsService>(SponsorsService);
    repository = module.get('ISponsorRepository') as jest.Mocked<ISponsorRepository>;
  });

  describe('findAll', () => {
    it('should return array of sponsors', async () => {
      repository.findAll.mockResolvedValue([mockSponsor]);

      const result = await service.findAll();

      expect(result).toEqual([mockSponsor]);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return sponsor when found', async () => {
      repository.findById.mockResolvedValue(mockSponsor);

      const result = await service.findOne('sponsor-123');

      expect(result).toEqual(mockSponsor);
      expect(repository.findById).toHaveBeenCalledWith('sponsor-123');
    });

    it('should throw SponsorNotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('sponsor-123')).rejects.toThrow(SponsorNotFoundException);
    });
  });
});
