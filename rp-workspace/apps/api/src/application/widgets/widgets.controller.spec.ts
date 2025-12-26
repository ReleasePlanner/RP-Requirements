import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { Widget, WidgetType } from '../../domain/entities/widget.entity';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

describe('WidgetsController', () => {
  let controller: WidgetsController;
  let service: jest.Mocked<WidgetsService>;

  const mockWidget: Widget = {
    widgetId: 'widget-123',
    title: 'Test Widget',
    type: WidgetType.STATS_OVERVIEW,
    config: { key: 'value' },
    isVisible: true,
    defaultOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Widget;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WidgetsController],
      providers: [
        {
          provide: WidgetsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WidgetsController>(WidgetsController);
    service = module.get(WidgetsService) as jest.Mocked<WidgetsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a widget', async () => {
      const createDto: CreateWidgetDto = {
        title: 'Test Widget',
        type: WidgetType.STATS_OVERVIEW,
      };

      service.create.mockResolvedValue(mockWidget);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockWidget);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all widgets', async () => {
      const widgets = [mockWidget];
      service.findAll.mockResolvedValue(widgets);

      const result = await controller.findAll();

      expect(result).toEqual(widgets);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a widget by id', async () => {
      service.findOne.mockResolvedValue(mockWidget);

      const result = await controller.findOne('widget-123');

      expect(result).toEqual(mockWidget);
      expect(service.findOne).toHaveBeenCalledWith('widget-123');
    });

    it('should throw NotFoundException when widget not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('widget-123')).rejects.toThrow(NotFoundException);
      await expect(controller.findOne('widget-123')).rejects.toThrow('Widget not found');
    });
  });

  describe('update', () => {
    it('should update a widget', async () => {
      const updateDto: UpdateWidgetDto = {
        title: 'Updated Widget',
      };

      const updatedWidget = { ...mockWidget, ...updateDto };
      service.update.mockResolvedValue(updatedWidget);

      const result = await controller.update('widget-123', updateDto);

      expect(result).toEqual(updatedWidget);
      expect(service.update).toHaveBeenCalledWith('widget-123', updateDto);
    });

    it('should throw NotFoundException when widget not found', async () => {
      const updateDto: UpdateWidgetDto = {
        title: 'Updated Widget',
      };

      service.update.mockResolvedValue(null);

      await expect(controller.update('widget-123', updateDto)).rejects.toThrow(NotFoundException);
      await expect(controller.update('widget-123', updateDto)).rejects.toThrow('Widget not found');
    });
  });

  describe('remove', () => {
    it('should delete a widget', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('widget-123');

      expect(service.remove).toHaveBeenCalledWith('widget-123');
    });
  });
});

