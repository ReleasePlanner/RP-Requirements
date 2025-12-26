import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from '../../application/catalogs/services/catalogs.service';

const mockCatalogsService = {
  findAllPriorities: jest.fn(),
  findAllStatuses: jest.fn(),
  findAllRiskLevels: jest.fn(),
  findAllComplexities: jest.fn(),
  findAllEffortEstimateTypes: jest.fn(),
  findAllRequirementTypes: jest.fn(),
};

describe('CatalogsController', () => {
  let controller: CatalogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogsController],
      providers: [
        {
          provide: CatalogsService,
          useValue: mockCatalogsService,
        },
      ],
    }).compile();

    controller = module.get<CatalogsController>(CatalogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return priorities', async () => {
    const result = [{ priorityId: 1, name: 'High' }];
    mockCatalogsService.findAllPriorities.mockResolvedValue(result);
    expect(await controller.findAllPriorities()).toBe(result);
  });

  it('should return statuses', async () => {
    const result = [{ statusId: 1, name: 'Open' }];
    mockCatalogsService.findAllStatuses.mockResolvedValue(result);
    expect(await controller.findAllStatuses()).toBe(result);
  });

  it('should return risk levels', async () => {
    const result = [{ riskLevelId: 1, name: 'High' }];
    mockCatalogsService.findAllRiskLevels.mockResolvedValue(result);
    expect(await controller.findAllRiskLevels()).toBe(result);
  });

  it('should return complexities', async () => {
    const result = [{ complexityId: 1, name: 'Complex' }];
    mockCatalogsService.findAllComplexities.mockResolvedValue(result);
    expect(await controller.findAllComplexities()).toBe(result);
  });

  it('should return effort types', async () => {
    const result = [{ effortEstimateTypeId: 1, name: 'Points' }];
    mockCatalogsService.findAllEffortEstimateTypes.mockResolvedValue(result);
    expect(await controller.findAllEffortTypes()).toBe(result);
  });

  it('should return types', async () => {
    const result = [{ typeId: 1, name: 'Bug' }];
    mockCatalogsService.findAllRequirementTypes.mockResolvedValue(result);
    expect(await controller.findAllTypes()).toBe(result);
  });
});
