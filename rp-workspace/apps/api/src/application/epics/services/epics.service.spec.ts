import { Test, TestingModule } from '@nestjs/testing';
import { EpicsService } from './epics.service';
import { NotFoundException } from '@nestjs/common';

const mockEpicsRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('EpicsService', () => {
  let service: EpicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpicsService,
        {
          provide: 'IEpicsRepository',
          useValue: mockEpicsRepository,
        },
      ],
    }).compile();

    service = module.get<EpicsService>(EpicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all epics', async () => {
    const result = [{ epicId: '1', name: 'Epic 1' }];
    mockEpicsRepository.findAll.mockResolvedValue(result);
    expect(await service.findAll()).toBe(result);
  });

  it('should return one epic', async () => {
    const result = { epicId: '1', name: 'Epic 1' };
    mockEpicsRepository.findById.mockResolvedValue(result);
    expect(await service.findOne('1')).toBe(result);
  });

  it('should throw error if epic not found', async () => {
    mockEpicsRepository.findById.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should create an epic', async () => {
    const result = { epicId: '1', name: 'Epic 1' };
    mockEpicsRepository.create.mockResolvedValue(result);
    expect(await service.create({ name: 'Epic 1' } as any)).toBe(result);
  });

  it('should update an epic', async () => {
    const result = { epicId: '1', name: 'Updated Epic' };
    mockEpicsRepository.findById.mockResolvedValue(result);
    mockEpicsRepository.update.mockResolvedValue(result);
    expect(await service.update('1', { name: 'Updated Epic' })).toBe(result);
  });

  it('should remove an epic', async () => {
    mockEpicsRepository.findById.mockResolvedValue({ epicId: '1' });
    mockEpicsRepository.delete.mockResolvedValue(undefined);
    expect(await service.remove('1')).toBeUndefined();
  });
});
