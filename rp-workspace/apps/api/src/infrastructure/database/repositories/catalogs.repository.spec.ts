import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsRepository } from './catalogs.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Priority } from '@domain/entities/priority.entity';
import { LifecycleStatus } from '@domain/entities/lifecycle-status.entity';
import { RiskLevel } from '@domain/entities/risk-level.entity';
import { Complexity } from '@domain/entities/complexity.entity';
import { EffortEstimateType } from '@domain/entities/effort-estimate-type.entity';
import { RequirementType } from '@domain/entities/requirement-type.entity';
import { VerificationMethod } from '@domain/entities/verification-method.entity';

const mockRepository = {
  find: jest.fn(),
};

describe('CatalogsRepository', () => {
  let repository: CatalogsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogsRepository,
        { provide: getRepositoryToken(Priority), useValue: mockRepository },
        { provide: getRepositoryToken(LifecycleStatus), useValue: mockRepository },
        { provide: getRepositoryToken(RiskLevel), useValue: mockRepository },
        { provide: getRepositoryToken(Complexity), useValue: mockRepository },
        { provide: getRepositoryToken(EffortEstimateType), useValue: mockRepository },
        { provide: getRepositoryToken(RequirementType), useValue: mockRepository },
        { provide: getRepositoryToken(VerificationMethod), useValue: mockRepository },
      ],
    }).compile();

    repository = module.get<CatalogsRepository>(CatalogsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAllPriorities', () => {
    it('should return priorities', async () => {
      const result = [new Priority()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllPriorities()).toBe(result);
    });
  });

  describe('findAllStatuses', () => {
    it('should return statuses', async () => {
      const result = [new LifecycleStatus()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllStatuses()).toBe(result);
    });
  });

  describe('findAllRiskLevels', () => {
    it('should return risk levels', async () => {
      const result = [new RiskLevel()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllRiskLevels()).toBe(result);
    });
  });

  describe('findAllComplexities', () => {
    it('should return complexities', async () => {
      const result = [new Complexity()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllComplexities()).toBe(result);
    });
  });

  describe('findAllEffortEstimateTypes', () => {
    it('should return effort types', async () => {
      const result = [new EffortEstimateType()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllEffortEstimateTypes()).toBe(result);
    });
  });

  describe('findAllRequirementTypes', () => {
    it('should return types', async () => {
      const result = [new RequirementType()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllRequirementTypes()).toBe(result);
    });
  });

  describe('findAllVerificationMethods', () => {
    it('should return verification methods', async () => {
      const result = [new VerificationMethod()];
      mockRepository.find.mockResolvedValue(result);
      expect(await repository.findAllVerificationMethods()).toBe(result);
    });
  });
});
