import { Test, TestingModule } from '@nestjs/testing';
import { RequirementReferencesService } from './requirement-references.service';
import { IRequirementReferenceRepository } from '../interfaces/repositories/requirement-reference.repository.interface';
import { CreateRequirementReferenceDto } from '../dto/create-requirement-reference.dto';
import { UpdateRequirementReferenceDto } from '../dto/update-requirement-reference.dto';
import { RequirementReference } from '@domain/entities/requirement-reference.entity';

describe('RequirementReferencesService', () => {
  let service: RequirementReferencesService;
  let repository: jest.Mocked<IRequirementReferenceRepository>;

  const mockReference: RequirementReference = {
    referenceId: 'ref-123',
    requirementId: 'req-123',
    type: 'DOCUMENT',
    path: 'https://example.com/doc',
    referenceName: 'Test Reference',
    description: 'Test Description',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as RequirementReference;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByRequirementId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementReferencesService,
        {
          provide: 'IRequirementReferenceRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RequirementReferencesService>(RequirementReferencesService);
    repository = module.get('IRequirementReferenceRepository') as jest.Mocked<IRequirementReferenceRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a requirement reference', async () => {
      const createDto: CreateRequirementReferenceDto = {
        requirementId: 'req-123',
        type: 'DOCUMENT',
        path: 'https://example.com/doc',
        referenceName: 'Test Reference',
        status: 'Active',
      };

      repository.create.mockResolvedValue(mockReference);

      const result = await service.create(createDto);

      expect(result).toEqual(mockReference);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a requirement reference', async () => {
      const updateDto: UpdateRequirementReferenceDto = {
        referenceName: 'Updated Reference',
      };

      const updatedReference = { ...mockReference, ...updateDto };
      repository.update.mockResolvedValue(updatedReference);

      const result = await service.update('ref-123', updateDto);

      expect(result).toEqual(updatedReference);
      expect(repository.update).toHaveBeenCalledWith('ref-123', updateDto);
    });
  });

  describe('delete', () => {
    it('should delete a requirement reference', async () => {
      repository.delete.mockResolvedValue(undefined);

      await service.delete('ref-123');

      expect(repository.delete).toHaveBeenCalledWith('ref-123');
    });
  });

  describe('findByRequirementId', () => {
    it('should find references by requirement id', async () => {
      const references = [mockReference];
      repository.findByRequirementId.mockResolvedValue(references);

      const result = await service.findByRequirementId('req-123');

      expect(result).toEqual(references);
      expect(repository.findByRequirementId).toHaveBeenCalledWith('req-123');
    });

    it('should return empty array when no references found', async () => {
      repository.findByRequirementId.mockResolvedValue([]);

      const result = await service.findByRequirementId('req-123');

      expect(result).toEqual([]);
    });
  });
});

