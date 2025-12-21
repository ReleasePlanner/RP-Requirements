import { Test, TestingModule } from '@nestjs/testing';
import { EpicsController } from './epics.controller';
import { EpicsService } from '@application/epics/services/epics.service';
import { CreateEpicDto } from '@application/epics/dtos/create-epic.dto';
import { UpdateEpicDto } from '@application/epics/dtos/update-epic.dto';

const mockEpicsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EpicsController', () => {
  let controller: EpicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpicsController],
      providers: [
        {
          provide: EpicsService,
          useValue: mockEpicsService,
        },
      ],
    }).compile();

    controller = module.get<EpicsController>(EpicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an epic', async () => {
      const dto = new CreateEpicDto();
      const result = { epicId: '1', ...dto };
      mockEpicsService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(mockEpicsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all epics', async () => {
      const result = [{ epicId: '1' }];
      mockEpicsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockEpicsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one epic', async () => {
      const result = { epicId: '1' };
      mockEpicsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockEpicsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an epic', async () => {
      const dto = new UpdateEpicDto();
      const result = { epicId: '1', ...dto };
      mockEpicsService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
      expect(mockEpicsService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove an epic', async () => {
      mockEpicsService.remove.mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      expect(mockEpicsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
