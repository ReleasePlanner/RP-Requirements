import { Test, TestingModule } from '@nestjs/testing';
import { CatalogsService } from './catalogs.service';
import { Priority } from '../../../domain/entities/priority.entity';
import { LifecycleStatus } from '../../../domain/entities/lifecycle-status.entity';
import { RiskLevel } from '../../../domain/entities/risk-level.entity';
import { Complexity } from '../../../domain/entities/complexity.entity';
import { EffortEstimateType } from '../../../domain/entities/effort-estimate-type.entity';
import { RequirementType } from '../../../domain/entities/requirement-type.entity';
import { VerificationMethod } from '../../../domain/entities/verification-method.entity';
import { Metric } from '../../../domain/entities/metric.entity';
import { ProductOwner } from '../../../domain/entities/product-owner.entity';
import { Approver } from '../../../domain/entities/approver.entity';

const mockCatalogsRepository = {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Priorities', () => {
  it('should return all priorities', async () => {
      const result = [{ priorityId: 1, name: 'High' }] as Priority[];
    mockCatalogsRepository.findAllPriorities.mockResolvedValue(result);
    expect(await service.findAllPriorities()).toBe(result);
  });

    it('should create a priority', async () => {
      const priority = { name: 'High' };
      const result = { priorityId: 1, ...priority } as Priority;
      mockCatalogsRepository.createPriority.mockResolvedValue(result);
      expect(await service.createPriority(priority)).toBe(result);
      expect(mockCatalogsRepository.createPriority).toHaveBeenCalledWith(priority);
    });

    it('should update a priority', async () => {
      const priority = { name: 'Medium' };
      const result = { priorityId: 1, ...priority } as Priority;
      mockCatalogsRepository.updatePriority.mockResolvedValue(result);
      expect(await service.updatePriority(1, priority)).toBe(result);
      expect(mockCatalogsRepository.updatePriority).toHaveBeenCalledWith(1, priority);
    });

    it('should delete a priority', async () => {
      mockCatalogsRepository.deletePriority.mockResolvedValue(undefined);
      await service.deletePriority(1);
      expect(mockCatalogsRepository.deletePriority).toHaveBeenCalledWith(1);
    });
  });

  describe('Statuses', () => {
  it('should return all statuses', async () => {
      const result = [{ statusId: 1, name: 'Open' }] as LifecycleStatus[];
    mockCatalogsRepository.findAllStatuses.mockResolvedValue(result);
    expect(await service.findAllStatuses()).toBe(result);
  });

    it('should create a status', async () => {
      const status = { name: 'Open' };
      const result = { statusId: 1, ...status } as LifecycleStatus;
      mockCatalogsRepository.createStatus.mockResolvedValue(result);
      expect(await service.createStatus(status)).toBe(result);
      expect(mockCatalogsRepository.createStatus).toHaveBeenCalledWith(status);
    });

    it('should update a status', async () => {
      const status = { name: 'Closed' };
      const result = { statusId: 1, ...status } as LifecycleStatus;
      mockCatalogsRepository.updateStatus.mockResolvedValue(result);
      expect(await service.updateStatus(1, status)).toBe(result);
      expect(mockCatalogsRepository.updateStatus).toHaveBeenCalledWith(1, status);
    });

    it('should delete a status', async () => {
      mockCatalogsRepository.deleteStatus.mockResolvedValue(undefined);
      await service.deleteStatus(1);
      expect(mockCatalogsRepository.deleteStatus).toHaveBeenCalledWith(1);
    });
  });

  describe('RiskLevels', () => {
  it('should return all risk levels', async () => {
      const result = [{ riskLevelId: 1, name: 'High' }] as RiskLevel[];
    mockCatalogsRepository.findAllRiskLevels.mockResolvedValue(result);
    expect(await service.findAllRiskLevels()).toBe(result);
  });

    it('should create a risk level', async () => {
      const riskLevel = { name: 'High' };
      const result = { riskLevelId: 1, ...riskLevel } as RiskLevel;
      mockCatalogsRepository.createRiskLevel.mockResolvedValue(result);
      expect(await service.createRiskLevel(riskLevel)).toBe(result);
      expect(mockCatalogsRepository.createRiskLevel).toHaveBeenCalledWith(riskLevel);
    });

    it('should update a risk level', async () => {
      const riskLevel = { name: 'Low' };
      const result = { riskLevelId: 1, ...riskLevel } as RiskLevel;
      mockCatalogsRepository.updateRiskLevel.mockResolvedValue(result);
      expect(await service.updateRiskLevel(1, riskLevel)).toBe(result);
      expect(mockCatalogsRepository.updateRiskLevel).toHaveBeenCalledWith(1, riskLevel);
    });

    it('should delete a risk level', async () => {
      mockCatalogsRepository.deleteRiskLevel.mockResolvedValue(undefined);
      await service.deleteRiskLevel(1);
      expect(mockCatalogsRepository.deleteRiskLevel).toHaveBeenCalledWith(1);
    });
  });

  describe('Complexities', () => {
  it('should return all complexities', async () => {
      const result = [{ complexityId: 1, name: 'Complex' }] as Complexity[];
    mockCatalogsRepository.findAllComplexities.mockResolvedValue(result);
    expect(await service.findAllComplexities()).toBe(result);
  });

    it('should create a complexity', async () => {
      const complexity = { name: 'Complex' };
      const result = { complexityId: 1, ...complexity } as Complexity;
      mockCatalogsRepository.createComplexity.mockResolvedValue(result);
      expect(await service.createComplexity(complexity)).toBe(result);
      expect(mockCatalogsRepository.createComplexity).toHaveBeenCalledWith(complexity);
    });

    it('should update a complexity', async () => {
      const complexity = { name: 'Simple' };
      const result = { complexityId: 1, ...complexity } as Complexity;
      mockCatalogsRepository.updateComplexity.mockResolvedValue(result);
      expect(await service.updateComplexity(1, complexity)).toBe(result);
      expect(mockCatalogsRepository.updateComplexity).toHaveBeenCalledWith(1, complexity);
    });

    it('should delete a complexity', async () => {
      mockCatalogsRepository.deleteComplexity.mockResolvedValue(undefined);
      await service.deleteComplexity(1);
      expect(mockCatalogsRepository.deleteComplexity).toHaveBeenCalledWith(1);
    });
  });

  describe('EffortEstimateTypes', () => {
  it('should return all effort types', async () => {
      const result = [{ effortTypeId: 1, name: 'Points' }] as EffortEstimateType[];
    mockCatalogsRepository.findAllEffortEstimateTypes.mockResolvedValue(result);
    expect(await service.findAllEffortEstimateTypes()).toBe(result);
  });

    it('should create an effort estimate type', async () => {
      const type = { name: 'Points' };
      const result = { effortTypeId: 1, ...type } as EffortEstimateType;
      mockCatalogsRepository.createEffortEstimateType.mockResolvedValue(result);
      expect(await service.createEffortEstimateType(type)).toBe(result);
      expect(mockCatalogsRepository.createEffortEstimateType).toHaveBeenCalledWith(type);
    });

    it('should update an effort estimate type', async () => {
      const type = { name: 'Hours' };
      const result = { effortTypeId: 1, ...type } as EffortEstimateType;
      mockCatalogsRepository.updateEffortEstimateType.mockResolvedValue(result);
      expect(await service.updateEffortEstimateType(1, type)).toBe(result);
      expect(mockCatalogsRepository.updateEffortEstimateType).toHaveBeenCalledWith(1, type);
    });

    it('should delete an effort estimate type', async () => {
      mockCatalogsRepository.deleteEffortEstimateType.mockResolvedValue(undefined);
      await service.deleteEffortEstimateType(1);
      expect(mockCatalogsRepository.deleteEffortEstimateType).toHaveBeenCalledWith(1);
    });
  });

  describe('RequirementTypes', () => {
  it('should return all types', async () => {
      const result = [{ typeId: 1, name: 'Bug' }] as RequirementType[];
    mockCatalogsRepository.findAllRequirementTypes.mockResolvedValue(result);
    expect(await service.findAllRequirementTypes()).toBe(result);
    });

    it('should create a requirement type', async () => {
      const type = { name: 'Bug' };
      const result = { typeId: 1, ...type } as RequirementType;
      mockCatalogsRepository.createRequirementType.mockResolvedValue(result);
      expect(await service.createRequirementType(type)).toBe(result);
      expect(mockCatalogsRepository.createRequirementType).toHaveBeenCalledWith(type);
    });

    it('should update a requirement type', async () => {
      const type = { name: 'Feature' };
      const result = { typeId: 1, ...type } as RequirementType;
      mockCatalogsRepository.updateRequirementType.mockResolvedValue(result);
      expect(await service.updateRequirementType(1, type)).toBe(result);
      expect(mockCatalogsRepository.updateRequirementType).toHaveBeenCalledWith(1, type);
    });

    it('should delete a requirement type', async () => {
      mockCatalogsRepository.deleteRequirementType.mockResolvedValue(undefined);
      await service.deleteRequirementType(1);
      expect(mockCatalogsRepository.deleteRequirementType).toHaveBeenCalledWith(1);
    });
  });

  describe('VerificationMethods', () => {
    it('should return all verification methods', async () => {
      const result = [{ verificationMethodId: 1, name: 'Test' }] as VerificationMethod[];
      mockCatalogsRepository.findAllVerificationMethods.mockResolvedValue(result);
      expect(await service.findAllVerificationMethods()).toBe(result);
    });

    it('should create a verification method', async () => {
      const method = { name: 'Test' };
      const result = { verificationMethodId: 1, ...method } as VerificationMethod;
      mockCatalogsRepository.createVerificationMethod.mockResolvedValue(result);
      expect(await service.createVerificationMethod(method)).toBe(result);
      expect(mockCatalogsRepository.createVerificationMethod).toHaveBeenCalledWith(method);
    });

    it('should update a verification method', async () => {
      const method = { name: 'Review' };
      const result = { verificationMethodId: 1, ...method } as VerificationMethod;
      mockCatalogsRepository.updateVerificationMethod.mockResolvedValue(result);
      expect(await service.updateVerificationMethod(1, method)).toBe(result);
      expect(mockCatalogsRepository.updateVerificationMethod).toHaveBeenCalledWith(1, method);
    });

    it('should delete a verification method', async () => {
      mockCatalogsRepository.deleteVerificationMethod.mockResolvedValue(undefined);
      await service.deleteVerificationMethod(1);
      expect(mockCatalogsRepository.deleteVerificationMethod).toHaveBeenCalledWith(1);
    });
  });

  describe('Metrics', () => {
    it('should return all metrics', async () => {
      const result = [{ metricId: 1, name: 'Velocity' }] as Metric[];
      mockCatalogsRepository.findAllMetrics.mockResolvedValue(result);
      expect(await service.findAllMetrics()).toBe(result);
    });

    it('should create a metric', async () => {
      const metric = { name: 'Velocity' };
      const result = { metricId: 1, ...metric } as Metric;
      mockCatalogsRepository.createMetric.mockResolvedValue(result);
      expect(await service.createMetric(metric)).toBe(result);
      expect(mockCatalogsRepository.createMetric).toHaveBeenCalledWith(metric);
    });

    it('should update a metric', async () => {
      const metric = { name: 'Quality' };
      const result = { metricId: 1, ...metric } as Metric;
      mockCatalogsRepository.updateMetric.mockResolvedValue(result);
      expect(await service.updateMetric(1, metric)).toBe(result);
      expect(mockCatalogsRepository.updateMetric).toHaveBeenCalledWith(1, metric);
    });

    it('should delete a metric', async () => {
      mockCatalogsRepository.deleteMetric.mockResolvedValue(undefined);
      await service.deleteMetric(1);
      expect(mockCatalogsRepository.deleteMetric).toHaveBeenCalledWith(1);
    });
  });

  describe('ProductOwners', () => {
    it('should return all product owners', async () => {
      const result = [
        {
          productOwnerId: 'owner-1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'ProductOwner',
          status: 'Active',
        },
      ] as ProductOwner[];
      mockCatalogsRepository.findAllProductOwners.mockResolvedValue(result);
      expect(await service.findAllProductOwners()).toBe(result);
    });

    it('should create a product owner', async () => {
      const owner = { firstName: 'John', lastName: 'Doe', role: 'ProductOwner' };
      const result = { productOwnerId: 'owner-1', ...owner, status: 'Active' } as ProductOwner;
      mockCatalogsRepository.createProductOwner.mockResolvedValue(result);
      expect(await service.createProductOwner(owner)).toBe(result);
      expect(mockCatalogsRepository.createProductOwner).toHaveBeenCalledWith(owner);
    });

    it('should update a product owner', async () => {
      const owner = { firstName: 'Jane' };
      const result = {
        productOwnerId: 'owner-1',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'ProductOwner',
        status: 'Active',
      } as ProductOwner;
      mockCatalogsRepository.updateProductOwner.mockResolvedValue(result);
      expect(await service.updateProductOwner('owner-1', owner)).toBe(result);
      expect(mockCatalogsRepository.updateProductOwner).toHaveBeenCalledWith('owner-1', owner);
    });

    it('should delete a product owner', async () => {
      mockCatalogsRepository.deleteProductOwner.mockResolvedValue(undefined);
      await service.deleteProductOwner('owner-1');
      expect(mockCatalogsRepository.deleteProductOwner).toHaveBeenCalledWith('owner-1');
    });
  });

  describe('Approvers', () => {
    it('should return all approvers', async () => {
      const result = [
        {
          approverId: 'approver-1',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Approver',
          status: 'Active',
        },
      ] as Approver[];
      mockCatalogsRepository.findAllApprovers.mockResolvedValue(result);
      expect(await service.findAllApprovers()).toBe(result);
    });

    it('should create an approver', async () => {
      const approver = { firstName: 'John', lastName: 'Doe', role: 'Approver' };
      const result = { approverId: 'approver-1', ...approver, status: 'Active' } as Approver;
      mockCatalogsRepository.createApprover.mockResolvedValue(result);
      expect(await service.createApprover(approver)).toBe(result);
      expect(mockCatalogsRepository.createApprover).toHaveBeenCalledWith(approver);
    });

    it('should update an approver', async () => {
      const approver = { firstName: 'Jane' };
      const result = {
        approverId: 'approver-1',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Approver',
        status: 'Active',
      } as Approver;
      mockCatalogsRepository.updateApprover.mockResolvedValue(result);
      expect(await service.updateApprover('approver-1', approver)).toBe(result);
      expect(mockCatalogsRepository.updateApprover).toHaveBeenCalledWith('approver-1', approver);
    });

    it('should delete an approver', async () => {
      mockCatalogsRepository.deleteApprover.mockResolvedValue(undefined);
      await service.deleteApprover('approver-1');
      expect(mockCatalogsRepository.deleteApprover).toHaveBeenCalledWith('approver-1');
    });
  });
});
