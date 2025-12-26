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
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
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

  describe('create', () => {
    it('should create a sponsor', async () => {
      const createDto = {
        name: 'New Sponsor',
        email: 'new@example.com',
        password: 'password123',
        role: 'Sponsor',
      };
      const createdSponsor = { ...mockSponsor, ...createDto };
      repository.create.mockResolvedValue(createdSponsor);

      const result = await service.create(createDto);

      expect(result).toEqual(createdSponsor);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a sponsor', async () => {
      const updateDto = { name: 'Updated Sponsor' };
      const updatedSponsor = { ...mockSponsor, ...updateDto };
      repository.findById.mockResolvedValue(mockSponsor);
      repository.update.mockResolvedValue(updatedSponsor);

      const result = await service.update('sponsor-123', updateDto);

      expect(result).toEqual(updatedSponsor);
      expect(repository.findById).toHaveBeenCalledWith('sponsor-123');
      expect(repository.update).toHaveBeenCalledWith('sponsor-123', updateDto);
    });

    it('should throw SponsorNotFoundException when sponsor not found', async () => {
      const updateDto = { name: 'Updated Sponsor' };
      repository.findById.mockResolvedValue(null);

      await expect(service.update('sponsor-123', updateDto)).rejects.toThrow(
        SponsorNotFoundException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a sponsor', async () => {
      repository.findById.mockResolvedValue(mockSponsor);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('sponsor-123');

      expect(repository.findById).toHaveBeenCalledWith('sponsor-123');
      expect(repository.delete).toHaveBeenCalledWith('sponsor-123');
    });

    it('should throw SponsorNotFoundException when sponsor not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('sponsor-123')).rejects.toThrow(SponsorNotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
