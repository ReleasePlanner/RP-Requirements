import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsService } from './requirements.service';
import { IRequirementRepository } from '../interfaces/repositories/requirement.repository.interface';
import { RequirementNotFoundException } from '@shared/exceptions/entity-not-found.exception';
import { Requirement } from '@domain/entities/requirement.entity';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';

describe('RequirementsService', () => {
  let service: RequirementsService;
  let repository: jest.Mocked<IRequirementRepository>;

  const mockRequirement: Requirement = {
    requirementId: 'req-123',
    title: 'Test Requirement',
    storyStatement: 'As a user...',
    acceptanceCriteria: 'Given...',
    effortEstimate: 5,
    businessValue: 10000,
    creationDate: new Date(),
    goLiveDate: new Date(),
  } as Requirement;

  beforeEach(async () => {
    const mockRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByEpicId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementsService,
        {
          provide: 'IRequirementRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RequirementsService>(RequirementsService);
    repository = module.get('IRequirementRepository') as jest.Mocked<IRequirementRepository>;
  });

  describe('findAll', () => {
    it('should return paginated requirements', async () => {
      const resultData = { items: [mockRequirement], total: 1 };
      repository.findAll.mockResolvedValue(resultData);

      const result = await service.findAll();

      expect(result).toEqual(resultData);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return requirement when found', async () => {
      repository.findById.mockResolvedValue(mockRequirement);

      const result = await service.findOne('req-123');

      expect(result).toEqual(mockRequirement);
      expect(repository.findById).toHaveBeenCalledWith('req-123');
    });

    it('should throw RequirementNotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('req-123')).rejects.toThrow(RequirementNotFoundException);
    });
  });

  describe('findByEpicId', () => {
    it('should return requirements for epic', async () => {
      repository.findByEpicId.mockResolvedValue([mockRequirement]);

      const result = await service.findByEpicId('epic-123');

      expect(result).toEqual([mockRequirement]);
      expect(repository.findByEpicId).toHaveBeenCalledWith('epic-123');
    });
  });

  describe('create', () => {
    it('should create and return requirement', async () => {
      const createDto: CreateRequirementDto = {
        title: 'New Requirement',
        storyStatement: 'As a user...',
      };

      repository.create.mockResolvedValue(mockRequirement);

      const result = await service.create(createDto);

      expect(result).toEqual(mockRequirement);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return requirement', async () => {
      const updateDto: UpdateRequirementDto = {
        title: 'Updated Requirement',
      };

      repository.findById.mockResolvedValue(mockRequirement);
      repository.update.mockResolvedValue({
        ...mockRequirement,
        ...updateDto,
      });

      const result = await service.update('req-123', updateDto);

      expect(result.title).toBe('Updated Requirement');
      expect(repository.update).toHaveBeenCalledWith('req-123', updateDto);
    });

    it('should throw RequirementNotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('req-123', { title: 'Updated' })).rejects.toThrow(
        RequirementNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete requirement', async () => {
      repository.findById.mockResolvedValue(mockRequirement);
      repository.delete.mockResolvedValue(undefined);

      await service.delete('req-123');

      expect(repository.delete).toHaveBeenCalledWith('req-123');
    });

    it('should throw RequirementNotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('req-123')).rejects.toThrow(RequirementNotFoundException);
    });
  });
});
