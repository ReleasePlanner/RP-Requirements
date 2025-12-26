import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsService } from './catalogs.service';

const mockCatalogsRepository = {
  findAllPriorities: jest.fn(),
  findAllStatuses: jest.fn(),
  findAllRiskLevels: jest.fn(),
  findAllComplexities: jest.fn(),
  findAllEffortEstimateTypes: jest.fn(),
  findAllRequirementTypes: jest.fn(),
};

describe('CatalogsService', () => {
  let service: CatalogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogsService,
        {
          provide: 'ICatalogsRepository',
          useValue: mockCatalogsRepository,
        },
      ],
    }).compile();

    service = module.get<CatalogsService>(CatalogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all priorities', async () => {
    const result = [{ priorityId: 1, name: 'High' }];
    mockCatalogsRepository.findAllPriorities.mockResolvedValue(result);
    expect(await service.findAllPriorities()).toBe(result);
  });

  it('should return all statuses', async () => {
    const result = [{ statusId: 1, name: 'Open' }];
    mockCatalogsRepository.findAllStatuses.mockResolvedValue(result);
    expect(await service.findAllStatuses()).toBe(result);
  });

  it('should return all risk levels', async () => {
    const result = [{ riskLevelId: 1, name: 'High' }];
    mockCatalogsRepository.findAllRiskLevels.mockResolvedValue(result);
    expect(await service.findAllRiskLevels()).toBe(result);
  });

  it('should return all complexities', async () => {
    const result = [{ complexityId: 1, name: 'Complex' }];
    mockCatalogsRepository.findAllComplexities.mockResolvedValue(result);
    expect(await service.findAllComplexities()).toBe(result);
  });

  it('should return all effort types', async () => {
    const result = [{ effortEstimateTypeId: 1, name: 'Points' }];
    mockCatalogsRepository.findAllEffortEstimateTypes.mockResolvedValue(result);
    expect(await service.findAllEffortEstimateTypes()).toBe(result);
  });

  it('should return all types', async () => {
    const result = [{ typeId: 1, name: 'Bug' }];
    mockCatalogsRepository.findAllRequirementTypes.mockResolvedValue(result);
    expect(await service.findAllRequirementTypes()).toBe(result);
  });
});
