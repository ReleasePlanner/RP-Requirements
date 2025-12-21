import { Test, TestingModule } from '@nestjs/testing';
import { InitiativesService } from './initiatives.service';
import { NotFoundException } from '@nestjs/common';

const mockInitiativesRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('InitiativesService', () => {
  let service: InitiativesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitiativesService,
        {
          provide: 'IInitiativesRepository',
          useValue: mockInitiativesRepository,
        },
      ],
    }).compile();

    service = module.get<InitiativesService>(InitiativesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all initiatives', async () => {
    const result = [{ initiativeId: '1', title: 'Initiative 1' }];
    mockInitiativesRepository.findAll.mockResolvedValue(result);
    expect(await service.findAll()).toBe(result);
  });

  it('should return one initiative', async () => {
    const result = { initiativeId: '1', title: 'Initiative 1' };
    mockInitiativesRepository.findById.mockResolvedValue(result);
    expect(await service.findOne('1')).toBe(result);
  });

  it('should throw error if initiative not found', async () => {
    mockInitiativesRepository.findById.mockResolvedValue(null);
    await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should create an initiative', async () => {
    const result = { initiativeId: '1', title: 'Init 1' };
    mockInitiativesRepository.create.mockResolvedValue(result);
    expect(await service.create({ title: 'Init 1' } as any)).toBe(result);
  });

  it('should update an initiative', async () => {
    const result = { initiativeId: '1', title: 'Updated Init' };
    mockInitiativesRepository.findById.mockResolvedValue(result);
    mockInitiativesRepository.update.mockResolvedValue(result);
    expect(await service.update('1', { title: 'Updated Init' })).toBe(result);
  });

  it('should remove an initiative', async () => {
    mockInitiativesRepository.findById.mockResolvedValue({ initiativeId: '1' });
    mockInitiativesRepository.delete.mockResolvedValue(undefined);
    expect(await service.remove('1')).toBeUndefined();
  });
});
