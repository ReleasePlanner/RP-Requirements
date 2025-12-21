import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from '@application/requirements/services/requirements.service';
import { Requirement } from '@domain/entities/requirement.entity';
import { CreateRequirementDto } from '@application/requirements/dto/create-requirement.dto';
import { UpdateRequirementDto } from '@application/requirements/dto/update-requirement.dto';

describe('RequirementsController', () => {
  let controller: RequirementsController;
  let service: jest.Mocked<RequirementsService>;

  const mockRequirement: Requirement = {
    requirementId: 'req-123',
    title: 'Test Requirement',
    storyStatement: 'As a user...',
    acceptanceCriteria: 'Given...',
    effortEstimate: 5,
    businessValue: 10000,
    creationDate: new Date(),
  } as Requirement;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByEpicId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementsController],
      providers: [
        {
          provide: RequirementsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RequirementsController>(RequirementsController);
    service = module.get(RequirementsService);
  });

  describe('create', () => {
    it('should create requirement', async () => {
      const createDto: CreateRequirementDto = {
        title: 'New Requirement',
      };

      service.create.mockResolvedValue(mockRequirement);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockRequirement);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all requirements', async () => {
      service.findAll.mockResolvedValue({ items: [mockRequirement], total: 1 });

      const result = await controller.findAll();

      expect(result).toEqual({ items: [mockRequirement], total: 1 });
      expect(service.findAll).toHaveBeenCalled();
    });

    // it('should filter by epicId when provided', async () => {
    //   service.findByEpicId.mockResolvedValue([mockRequirement]);

    //   const result = await controller.findAll('epic-123' as any);

    //   expect(result).toEqual([mockRequirement]);
    //   expect(service.findByEpicId).toHaveBeenCalledWith('epic-123');
    // });
  });

  describe('findOne', () => {
    it('should return requirement by id', async () => {
      service.findOne.mockResolvedValue(mockRequirement);

      const result = await controller.findOne('req-123');

      expect(result).toEqual(mockRequirement);
      expect(service.findOne).toHaveBeenCalledWith('req-123');
    });
  });

  describe('update', () => {
    it('should update requirement', async () => {
      const updateDto: UpdateRequirementDto = {
        title: 'Updated Requirement',
      };

      service.update.mockResolvedValue({
        ...mockRequirement,
        ...updateDto,
      });

      const result = await controller.update('req-123', updateDto);

      expect(result.title).toBe('Updated Requirement');
      expect(service.update).toHaveBeenCalledWith('req-123', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete requirement', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.remove('req-123');

      expect(service.delete).toHaveBeenCalledWith('req-123');
    });
  });
});
