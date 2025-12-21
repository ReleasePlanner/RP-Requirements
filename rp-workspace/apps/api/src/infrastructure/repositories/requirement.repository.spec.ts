import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequirementRepository } from './requirement.repository';
import { Requirement } from '@domain/entities/requirement.entity';

describe('RequirementRepository', () => {
  let repository: RequirementRepository;
  let typeOrmRepository: jest.Mocked<Repository<Requirement>>;

  const mockRequirement: Requirement = {
    requirementId: 'req-123',
    title: 'Test Requirement',
    storyStatement: 'As a user...',
    acceptanceCriteria: 'Given...',
    effortEstimate: 5,
    businessValue: 10000,
    creationDate: new Date(),
  } as Requirement;

  const mockRelations = [
    'priority',
    'status',
    'type',
    'complexity',
    'source',
    'effortType',
    'riskLevel',
    'metric',
    'verificationMethod',
    'epic',
    'productOwner',
    'approver',
  ];

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementRepository,
        {
          provide: getRepositoryToken(Requirement),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<RequirementRepository>(RequirementRepository);
    typeOrmRepository = module.get(getRepositoryToken(Requirement));
  });

  describe('findById', () => {
    it('should return requirement with relations', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockRequirement);

      const result = await repository.findById('req-123');

      expect(result).toEqual(mockRequirement);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { requirementId: 'req-123' },
        relations: mockRelations,
      });
    });
  });

  describe('findAll', () => {
    it('should return all requirements with relations', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockRequirement], 1]),
      };

      typeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await repository.findAll({});

      expect(result).toEqual({ items: [mockRequirement], total: 1 });
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('req');
    });
  });

  describe('findByEpicId', () => {
    it('should return requirements by epic id', async () => {
      typeOrmRepository.find.mockResolvedValue([mockRequirement]);

      const result = await repository.findByEpicId('epic-123');

      expect(result).toEqual([mockRequirement]);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { epicId: 'epic-123' },
        relations: mockRelations,
      });
    });
  });

  describe('create', () => {
    it('should create requirement', async () => {
      const requirementData = {
        title: 'New Requirement',
        storyStatement: 'As a user...',
      };

      typeOrmRepository.create.mockReturnValue(mockRequirement as Requirement);
      typeOrmRepository.save.mockResolvedValue(mockRequirement);

      const result = await repository.create(requirementData);

      expect(result).toEqual(mockRequirement);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(requirementData);
    });
  });

  describe('update', () => {
    it('should update requirement', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedRequirement = { ...mockRequirement, ...updateData };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(updatedRequirement);

      const result = await repository.update('req-123', updateData);

      expect(result.title).toBe('Updated Title');
      expect(typeOrmRepository.update).toHaveBeenCalledWith('req-123', updateData);
    });

    it('should throw error when requirement not found after update', async () => {
      const updateData = { title: 'Updated Title' };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('req-123', updateData)).rejects.toThrow(
        'Requirement not found after update',
      );
    });
  });

  describe('delete', () => {
    it('should delete requirement', async () => {
      typeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('req-123');

      expect(typeOrmRepository.delete).toHaveBeenCalledWith('req-123');
    });
  });
});
