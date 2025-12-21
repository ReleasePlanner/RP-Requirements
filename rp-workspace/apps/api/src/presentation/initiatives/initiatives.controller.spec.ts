import { Test, TestingModule } from '@nestjs/testing';
import { InitiativesController } from './initiatives.controller';
import { InitiativesService } from '@application/initiatives/services/initiatives.service';
import { CreateInitiativeDto } from '@application/initiatives/dtos/create-initiative.dto';
import { UpdateInitiativeDto } from '@application/initiatives/dtos/update-initiative.dto';

const mockInitiativesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('InitiativesController', () => {
  let controller: InitiativesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InitiativesController],
      providers: [
        {
          provide: InitiativesService,
          useValue: mockInitiativesService,
        },
      ],
    }).compile();

    controller = module.get<InitiativesController>(InitiativesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an initiative', async () => {
      const dto = new CreateInitiativeDto();
      const result = { initiativeId: '1', ...dto };
      mockInitiativesService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(mockInitiativesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all initiatives', async () => {
      const result = [{ initiativeId: '1' }];
      mockInitiativesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockInitiativesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one initiative', async () => {
      const result = { initiativeId: '1' };
      mockInitiativesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(mockInitiativesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an initiative', async () => {
      const dto = new UpdateInitiativeDto();
      const result = { initiativeId: '1', ...dto };
      mockInitiativesService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
      expect(mockInitiativesService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove an initiative', async () => {
      mockInitiativesService.remove.mockResolvedValue(undefined);

      expect(await controller.remove('1')).toBeUndefined();
      expect(mockInitiativesService.remove).toHaveBeenCalledWith('1');
    });
  });
});
