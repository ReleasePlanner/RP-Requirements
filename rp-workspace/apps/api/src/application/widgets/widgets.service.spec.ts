import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WidgetsService } from './widgets.service';
import { Widget, WidgetType } from '../../domain/entities/widget.entity';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

describe('WidgetsService', () => {
  let service: WidgetsService;
  let repository: jest.Mocked<Repository<Widget>>;

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
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetsService,
        {
          provide: getRepositoryToken(Widget),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WidgetsService>(WidgetsService);
    repository = module.get(getRepositoryToken(Widget)) as jest.Mocked<Repository<Widget>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a widget', async () => {
      const createDto: CreateWidgetDto = {
        title: 'Test Widget',
        type: WidgetType.STATS_OVERVIEW,
        config: { key: 'value' },
        isVisible: true,
        defaultOrder: 1,
      };

      repository.create.mockReturnValue(mockWidget);
      repository.save.mockResolvedValue(mockWidget);

      const result = await service.create(createDto);

      expect(result).toEqual(mockWidget);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockWidget);
    });
  });

  describe('findAll', () => {
    it('should return all widgets ordered by defaultOrder', async () => {
      const widgets = [mockWidget];
      repository.find.mockResolvedValue(widgets);

      const result = await service.findAll();

      expect(result).toEqual(widgets);
      expect(repository.find).toHaveBeenCalledWith({
        order: {
          defaultOrder: 'ASC',
        },
      });
    });

    it('should return empty array when no widgets', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a widget by id', async () => {
      repository.findOne.mockResolvedValue(mockWidget);

      const result = await service.findOne('widget-123');

      expect(result).toEqual(mockWidget);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { widgetId: 'widget-123' },
      });
    });

    it('should return null when widget not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('widget-123');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a widget with all fields', async () => {
      const updateDto: UpdateWidgetDto = {
        title: 'Updated Widget',
        type: WidgetType.REQUIREMENTS_CHART,
        config: { newKey: 'newValue' },
        isVisible: false,
        defaultOrder: 2,
      };

      const updatedWidget = { ...mockWidget, ...updateDto };
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(updatedWidget);

      const result = await service.update('widget-123', updateDto);

      expect(result).toEqual(updatedWidget);
      expect(repository.update).toHaveBeenCalledWith('widget-123', updateDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { widgetId: 'widget-123' },
      });
    });

    it('should update a widget with partial fields', async () => {
      const updateDto: UpdateWidgetDto = {
        title: 'Updated Widget',
      };

      const updatedWidget = { ...mockWidget, title: 'Updated Widget' };
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(updatedWidget);

      const result = await service.update('widget-123', updateDto);

      expect(result).toEqual(updatedWidget);
      expect(repository.update).toHaveBeenCalledWith('widget-123', { title: 'Updated Widget' });
    });

    it('should return null when widget not found', async () => {
      const updateDto: UpdateWidgetDto = {
        title: 'Updated Widget',
      };

      repository.update.mockResolvedValue({ affected: 0 } as any);
      repository.findOne.mockResolvedValue(null);

      const result = await service.update('widget-123', updateDto);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should delete a widget', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove('widget-123');

      expect(repository.delete).toHaveBeenCalledWith('widget-123');
    });
  });
});

