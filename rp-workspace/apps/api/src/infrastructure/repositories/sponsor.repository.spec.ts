import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SponsorRepository } from './sponsor.repository';
import { Sponsor } from '@domain/entities/sponsor.entity';

describe('SponsorRepository', () => {
  let repository: SponsorRepository;
  let typeOrmRepository: jest.Mocked<Repository<Sponsor>>;

  const mockSponsor: Sponsor = {
    sponsorId: 'sponsor-123',
    name: 'Test Sponsor',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'Sponsor',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sponsor;

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SponsorRepository,
        {
          provide: getRepositoryToken(Sponsor),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<SponsorRepository>(SponsorRepository);
    typeOrmRepository = module.get(getRepositoryToken(Sponsor));
  });

  describe('findById', () => {
    it('should return sponsor when found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockSponsor);

      const result = await repository.findById('sponsor-123');

      expect(result).toEqual(mockSponsor);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { sponsorId: 'sponsor-123' },
      });
    });

    it('should return null when not found', async () => {
      typeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById('sponsor-123');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return sponsor by email', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockSponsor);

      const result = await repository.findByEmail('test@example.com');

      expect(result).toEqual(mockSponsor);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all sponsors', async () => {
      typeOrmRepository.find.mockResolvedValue([mockSponsor]);

      const result = await repository.findAll();

      expect(result).toEqual([mockSponsor]);
      expect(typeOrmRepository.find).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and save sponsor', async () => {
      const sponsorData = {
        name: 'New Sponsor',
        email: 'new@example.com',
        password: 'hashedPassword',
      };

      typeOrmRepository.create.mockReturnValue(mockSponsor as Sponsor);
      typeOrmRepository.save.mockResolvedValue(mockSponsor);

      const result = await repository.create(sponsorData);

      expect(result).toEqual(mockSponsor);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(sponsorData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockSponsor);
    });
  });

  describe('update', () => {
    it('should update sponsor', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedSponsor = { ...mockSponsor, ...updateData };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(updatedSponsor);

      const result = await repository.update('sponsor-123', updateData);

      expect(result.name).toBe('Updated Name');
      expect(typeOrmRepository.update).toHaveBeenCalledWith('sponsor-123', updateData);
    });

    it('should throw error when sponsor not found after update', async () => {
      const updateData = { name: 'Updated Name' };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('sponsor-123', updateData)).rejects.toThrow(
        'Sponsor not found after update',
      );
    });
  });

  describe('delete', () => {
    it('should delete sponsor', async () => {
      typeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('sponsor-123');

      expect(typeOrmRepository.delete).toHaveBeenCalledWith('sponsor-123');
    });
  });
});
