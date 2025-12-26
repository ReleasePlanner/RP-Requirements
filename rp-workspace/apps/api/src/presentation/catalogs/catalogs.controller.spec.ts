import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsController } from './catalogs.controller';
import { CatalogsService } from '../../application/catalogs/services/catalogs.service';
import { Priority } from '@domain/entities/priority.entity';
import { LifecycleStatus } from '@domain/entities/lifecycle-status.entity';
import { RiskLevel } from '@domain/entities/risk-level.entity';
import { Complexity } from '@domain/entities/complexity.entity';
import { EffortEstimateType } from '@domain/entities/effort-estimate-type.entity';
import { RequirementType } from '@domain/entities/requirement-type.entity';
import { VerificationMethod } from '@domain/entities/verification-method.entity';
import { Metric } from '@domain/entities/metric.entity';
import { ProductOwner } from '@domain/entities/product-owner.entity';
import { Approver } from '@domain/entities/approver.entity';

const mockCatalogsService = {
  findAllPriorities: jest.fn(),
  createPriority: jest.fn(),
  updatePriority: jest.fn(),
  deletePriority: jest.fn(),
  findAllStatuses: jest.fn(),
  createStatus: jest.fn(),
  updateStatus: jest.fn(),
  deleteStatus: jest.fn(),
  findAllRiskLevels: jest.fn(),
  createRiskLevel: jest.fn(),
  updateRiskLevel: jest.fn(),
  deleteRiskLevel: jest.fn(),
  findAllComplexities: jest.fn(),
  createComplexity: jest.fn(),
  updateComplexity: jest.fn(),
  deleteComplexity: jest.fn(),
  findAllEffortEstimateTypes: jest.fn(),
  createEffortEstimateType: jest.fn(),
  updateEffortEstimateType: jest.fn(),
  deleteEffortEstimateType: jest.fn(),
  findAllRequirementTypes: jest.fn(),
  createRequirementType: jest.fn(),
  updateRequirementType: jest.fn(),
  deleteRequirementType: jest.fn(),
  findAllVerificationMethods: jest.fn(),
  createVerificationMethod: jest.fn(),
  updateVerificationMethod: jest.fn(),
  deleteVerificationMethod: jest.fn(),
  findAllMetrics: jest.fn(),
  createMetric: jest.fn(),
  updateMetric: jest.fn(),
  deleteMetric: jest.fn(),
  findAllProductOwners: jest.fn(),
  createProductOwner: jest.fn(),
  updateProductOwner: jest.fn(),
  deleteProductOwner: jest.fn(),
  findAllApprovers: jest.fn(),
  createApprover: jest.fn(),
  updateApprover: jest.fn(),
  deleteApprover: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test', () => {
    it('should return test response', async () => {
      const result = await controller.test();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('Priorities', () => {
  it('should return priorities', async () => {
      const result = [{ priorityId: 1, name: 'High' }] as Priority[];
    mockCatalogsService.findAllPriorities.mockResolvedValue(result);
    expect(await controller.findAllPriorities()).toBe(result);
  });

    it('should create a priority', async () => {
      const createDto = { name: 'High' };
      const result = { priorityId: 1, ...createDto } as Priority;
      mockCatalogsService.createPriority.mockResolvedValue(result);
      expect(await controller.createPriority(createDto as any)).toBe(result);
      expect(mockCatalogsService.createPriority).toHaveBeenCalledWith(createDto);
    });

    it('should update a priority', async () => {
      const updateDto = { name: 'Medium' };
      const result = { priorityId: 1, ...updateDto } as Priority;
      mockCatalogsService.updatePriority.mockResolvedValue(result);
      expect(await controller.updatePriority(1, updateDto as any)).toBe(result);
      expect(mockCatalogsService.updatePriority).toHaveBeenCalledWith(1, updateDto);
    });

    it('should delete a priority', async () => {
      mockCatalogsService.deletePriority.mockResolvedValue(undefined);
      await controller.deletePriority(1);
      expect(mockCatalogsService.deletePriority).toHaveBeenCalledWith(1);
    });
  });

  describe('Statuses', () => {
  it('should return statuses', async () => {
      const result = [{ statusId: 1, name: 'Open' }] as LifecycleStatus[];
    mockCatalogsService.findAllStatuses.mockResolvedValue(result);
    expect(await controller.findAllStatuses()).toBe(result);
  });

    it('should create a status', async () => {
      const createDto = { name: 'Open' };
      const result = { statusId: 1, ...createDto } as LifecycleStatus;
      mockCatalogsService.createStatus.mockResolvedValue(result);
      expect(await controller.createStatus(createDto as any)).toBe(result);
      expect(mockCatalogsService.createStatus).toHaveBeenCalledWith(createDto);
    });

    it('should update a status', async () => {
      const updateDto = { name: 'Closed' };
      const result = { statusId: 1, ...updateDto } as LifecycleStatus;
      mockCatalogsService.updateStatus.mockResolvedValue(result);
      expect(await controller.updateStatus(1, updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateStatus).toHaveBeenCalledWith(1, updateDto);
    });

    it('should delete a status', async () => {
      mockCatalogsService.deleteStatus.mockResolvedValue(undefined);
      await controller.deleteStatus(1);
      expect(mockCatalogsService.deleteStatus).toHaveBeenCalledWith(1);
    });
  });

  describe('RiskLevels', () => {
  it('should return risk levels', async () => {
      const result = [{ riskLevelId: 1, name: 'High' }] as RiskLevel[];
    mockCatalogsService.findAllRiskLevels.mockResolvedValue(result);
    expect(await controller.findAllRiskLevels()).toBe(result);
  });

    it('should create a risk level', async () => {
      const createDto = { name: 'High' };
      const result = { riskLevelId: 1, ...createDto } as RiskLevel;
      mockCatalogsService.createRiskLevel.mockResolvedValue(result);
      expect(await controller.createRiskLevel(createDto as any)).toBe(result);
      expect(mockCatalogsService.createRiskLevel).toHaveBeenCalledWith(createDto);
    });

    it('should update a risk level', async () => {
      const updateDto = { name: 'Low' };
      const result = { riskLevelId: 1, ...updateDto } as RiskLevel;
      mockCatalogsService.updateRiskLevel.mockResolvedValue(result);
      expect(await controller.updateRiskLevel(1, updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateRiskLevel).toHaveBeenCalledWith(1, updateDto);
    });

    it('should delete a risk level', async () => {
      mockCatalogsService.deleteRiskLevel.mockResolvedValue(undefined);
      await controller.deleteRiskLevel(1);
      expect(mockCatalogsService.deleteRiskLevel).toHaveBeenCalledWith(1);
    });
  });

  describe('Complexities', () => {
  it('should return complexities', async () => {
      const result = [{ complexityId: 1, name: 'Complex' }] as Complexity[];
    mockCatalogsService.findAllComplexities.mockResolvedValue(result);
    expect(await controller.findAllComplexities()).toBe(result);
  });

    it('should create a complexity', async () => {
      const createDto = { name: 'Complex' };
      const result = { complexityId: 1, ...createDto } as Complexity;
      mockCatalogsService.createComplexity.mockResolvedValue(result);
      expect(await controller.createComplexity(createDto as any)).toBe(result);
      expect(mockCatalogsService.createComplexity).toHaveBeenCalledWith(createDto);
    });

    it('should update a complexity', async () => {
      const updateDto = { name: 'Simple' };
      const result = { complexityId: 1, ...updateDto } as Complexity;
      mockCatalogsService.updateComplexity.mockResolvedValue(result);
      expect(await controller.updateComplexity(1, updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateComplexity).toHaveBeenCalledWith(1, updateDto);
    });

    it('should delete a complexity', async () => {
      mockCatalogsService.deleteComplexity.mockResolvedValue(undefined);
      await controller.deleteComplexity(1);
      expect(mockCatalogsService.deleteComplexity).toHaveBeenCalledWith(1);
    });
  });

  describe('EffortEstimateTypes', () => {
  it('should return effort types', async () => {
      const result = [{ effortTypeId: 1, name: 'Points' }] as EffortEstimateType[];
      mockCatalogsService.findAllEffortEstimateTypes.mockResolvedValue(result);
    expect(await controller.findAllEffortTypes()).toBe(result);
    });
  });

  describe('RequirementTypes', () => {
  it('should return types', async () => {
      const result = [{ typeId: 1, name: 'Bug' }] as RequirementType[];
      mockCatalogsService.findAllRequirementTypes.mockResolvedValue(result);
    expect(await controller.findAllTypes()).toBe(result);
    });

    it('should create a requirement type', async () => {
      const type = { name: 'Bug' };
      const result = { typeId: 1, ...type } as RequirementType;
      mockCatalogsService.createRequirementType.mockResolvedValue(result);
      expect(await controller.createType(type)).toBe(result);
      expect(mockCatalogsService.createRequirementType).toHaveBeenCalledWith(type);
    });

    it('should update a requirement type', async () => {
      const type = { name: 'Feature' };
      const result = { typeId: 1, ...type } as RequirementType;
      mockCatalogsService.updateRequirementType.mockResolvedValue(result);
      expect(await controller.updateType(1, type)).toBe(result);
      expect(mockCatalogsService.updateRequirementType).toHaveBeenCalledWith(1, type);
    });

    it('should delete a requirement type', async () => {
      mockCatalogsService.deleteRequirementType.mockResolvedValue(undefined);
      await controller.deleteType(1);
      expect(mockCatalogsService.deleteRequirementType).toHaveBeenCalledWith(1);
    });
  });

  describe('VerificationMethods', () => {
    it('should return verification methods', async () => {
      const result = [{ verificationMethodId: 1, name: 'Test' }] as VerificationMethod[];
      mockCatalogsService.findAllVerificationMethods.mockResolvedValue(result);
      expect(await controller.findAllVerificationMethods()).toBe(result);
    });

    it('should create a verification method', async () => {
      const createDto = { name: 'Test' };
      const result = { verificationMethodId: 1, ...createDto } as VerificationMethod;
      mockCatalogsService.createVerificationMethod.mockResolvedValue(result);
      expect(await controller.createVerificationMethod(createDto as any)).toBe(result);
      expect(mockCatalogsService.createVerificationMethod).toHaveBeenCalledWith(createDto);
    });

    it('should update a verification method', async () => {
      const updateDto = { name: 'Review' };
      const result = { verificationMethodId: 1, ...updateDto } as VerificationMethod;
      mockCatalogsService.updateVerificationMethod.mockResolvedValue(result);
      expect(await controller.updateVerificationMethod(1, updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateVerificationMethod).toHaveBeenCalledWith(1, updateDto);
    });

    it('should delete a verification method', async () => {
      mockCatalogsService.deleteVerificationMethod.mockResolvedValue(undefined);
      await controller.deleteVerificationMethod(1);
      expect(mockCatalogsService.deleteVerificationMethod).toHaveBeenCalledWith(1);
    });
  });

  describe('Metrics', () => {
    it('should return metrics', async () => {
      const result = [{ metricId: 1, name: 'Velocity' }] as Metric[];
      mockCatalogsService.findAllMetrics.mockResolvedValue(result);
      expect(await controller.findAllMetrics()).toBe(result);
    });

    it('should create a metric', async () => {
      const createDto = { name: 'Velocity' };
      const result = { metricId: 1, ...createDto } as Metric;
      mockCatalogsService.createMetric.mockResolvedValue(result);
      expect(await controller.createMetric(createDto as any)).toBe(result);
      expect(mockCatalogsService.createMetric).toHaveBeenCalledWith(createDto);
    });

    it('should update a metric', async () => {
      const updateDto = { name: 'Quality' };
      const result = { metricId: 1, ...updateDto } as Metric;
      mockCatalogsService.updateMetric.mockResolvedValue(result);
      expect(await controller.updateMetric(1, updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateMetric).toHaveBeenCalledWith(1, updateDto);
    });

    it('should delete a metric', async () => {
      mockCatalogsService.deleteMetric.mockResolvedValue(undefined);
      await controller.deleteMetric(1);
      expect(mockCatalogsService.deleteMetric).toHaveBeenCalledWith(1);
    });
  });

  describe('ProductOwners', () => {
    it('should return product owners', async () => {
      const result = [
        {
          productOwnerId: 'owner-1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'ProductOwner',
          status: 'Active',
        },
      ] as ProductOwner[];
      mockCatalogsService.findAllProductOwners.mockResolvedValue(result);
      expect(await controller.findAllProductOwners()).toBe(result);
    });

    it('should create a product owner', async () => {
      const createDto = { firstName: 'John', lastName: 'Doe', role: 'ProductOwner' };
      const result = { productOwnerId: 'owner-1', ...createDto, status: 'Active' } as ProductOwner;
      mockCatalogsService.createProductOwner.mockResolvedValue(result);
      expect(await controller.createProductOwner(createDto as any)).toBe(result);
      expect(mockCatalogsService.createProductOwner).toHaveBeenCalledWith(createDto);
    });

    it('should update a product owner', async () => {
      const updateDto = { firstName: 'Jane' };
      const result = {
        productOwnerId: 'owner-1',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'ProductOwner',
        status: 'Active',
      } as ProductOwner;
      mockCatalogsService.updateProductOwner.mockResolvedValue(result);
      expect(await controller.updateProductOwner('owner-1', updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateProductOwner).toHaveBeenCalledWith('owner-1', updateDto);
    });

    it('should delete a product owner', async () => {
      mockCatalogsService.deleteProductOwner.mockResolvedValue(undefined);
      await controller.deleteProductOwner('owner-1');
      expect(mockCatalogsService.deleteProductOwner).toHaveBeenCalledWith('owner-1');
    });
  });

  describe('Approvers', () => {
    it('should return approvers', async () => {
      const result = [
        {
          approverId: 'approver-1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Approver',
          status: 'Active',
        },
      ] as Approver[];
      mockCatalogsService.findAllApprovers.mockResolvedValue(result);
      expect(await controller.findAllApprovers()).toBe(result);
    });

    it('should create an approver', async () => {
      const createDto = { firstName: 'John', lastName: 'Doe', role: 'Approver' };
      const result = { approverId: 'approver-1', ...createDto, status: 'Active' } as Approver;
      mockCatalogsService.createApprover.mockResolvedValue(result);
      expect(await controller.createApprover(createDto as any)).toBe(result);
      expect(mockCatalogsService.createApprover).toHaveBeenCalledWith(createDto);
    });

    it('should update an approver', async () => {
      const updateDto = { firstName: 'Jane' };
      const result = {
        approverId: 'approver-1',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Approver',
        status: 'Active',
      } as Approver;
      mockCatalogsService.updateApprover.mockResolvedValue(result);
      expect(await controller.updateApprover('approver-1', updateDto as any)).toBe(result);
      expect(mockCatalogsService.updateApprover).toHaveBeenCalledWith('approver-1', updateDto);
    });

    it('should delete an approver', async () => {
      mockCatalogsService.deleteApprover.mockResolvedValue(undefined);
      await controller.deleteApprover('approver-1');
      expect(mockCatalogsService.deleteApprover).toHaveBeenCalledWith('approver-1');
    });
  });
});
