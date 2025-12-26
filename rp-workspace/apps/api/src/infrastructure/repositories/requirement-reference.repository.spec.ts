import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequirementReferenceRepository } from './requirement-reference.repository';
import { RequirementReference } from '@domain/entities/requirement-reference.entity';

describe('RequirementReferenceRepository', () => {
  let repository: RequirementReferenceRepository;
  let typeOrmRepository: jest.Mocked<Repository<RequirementReference>>;

  const mockReference: RequirementReference = {
    referenceId: 'ref-123',
    requirementId: 'req-123',
    type: 'DOCUMENT',
    path: 'https://example.com/doc',
    referenceName: 'Test Reference',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as RequirementReference;

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementReferenceRepository,
        {
          provide: getRepositoryToken(RequirementReference),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<RequirementReferenceRepository>(RequirementReferenceRepository);
    typeOrmRepository = module.get(getRepositoryToken(RequirementReference)) as jest.Mocked<
      Repository<RequirementReference>
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a requirement reference', async () => {
      const data = {
        requirementId: 'req-123',
        type: 'DOCUMENT',
        path: 'https://example.com/doc',
        referenceName: 'Test Reference',
      };

      typeOrmRepository.create.mockReturnValue(mockReference);
      typeOrmRepository.save.mockResolvedValue(mockReference);

      const result = await repository.create(data);

      expect(result).toEqual(mockReference);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(data);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockReference);
    });
  });

  describe('update', () => {
    it('should update a requirement reference', async () => {
      const data = {
        referenceName: 'Updated Reference',
      };

      const updatedReference = { ...mockReference, ...data };
      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(updatedReference);

      const result = await repository.update('ref-123', data);

      expect(result).toEqual(updatedReference);
      expect(typeOrmRepository.update).toHaveBeenCalledWith('ref-123', data);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { referenceId: 'ref-123' },
      });
    });

    it('should throw error when reference not found', async () => {
      const data = {
        referenceName: 'Updated Reference',
      };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('ref-123', data)).rejects.toThrow('Reference not found');
    });
  });

  describe('delete', () => {
    it('should delete a requirement reference', async () => {
      typeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('ref-123');

      expect(typeOrmRepository.delete).toHaveBeenCalledWith('ref-123');
    });
  });

  describe('findByRequirementId', () => {
    it('should find references by requirement id', async () => {
      const references = [mockReference];
      typeOrmRepository.find.mockResolvedValue(references);

      const result = await repository.findByRequirementId('req-123');

      expect(result).toEqual(references);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { requirementId: 'req-123' },
      });
    });

    it('should return empty array when no references found', async () => {
      typeOrmRepository.find.mockResolvedValue([]);

      const result = await repository.findByRequirementId('req-123');

      expect(result).toEqual([]);
    });
  });
});

