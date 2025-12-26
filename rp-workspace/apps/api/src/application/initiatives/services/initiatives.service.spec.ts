import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { Initiative } from '@domain/entities/initiative.entity';

const mockInitiativesRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('InitiativesService', () => {
  let service: InitiativesService;

  const mockInitiative = {
    initiativeId: '1',
    title: 'Initiative 1',
    status_text: 'ACTIVE',
    epics: [],
  } as unknown as Initiative;

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all initiatives', async () => {
      const result = [mockInitiative];
      mockInitiativesRepository.findAll.mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return one initiative', async () => {
      mockInitiativesRepository.findById.mockResolvedValue(mockInitiative);
      expect(await service.findOne('1')).toBe(mockInitiative);
      expect(mockInitiativesRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error if initiative not found', async () => {
      mockInitiativesRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an initiative', async () => {
      const createDto = { title: 'Init 1' };
      mockInitiativesRepository.create.mockResolvedValue(mockInitiative);
      const result = await service.create(createDto as any);
      expect(result).toBe(mockInitiative);
      expect(mockInitiativesRepository.create).toHaveBeenCalled();
      // The service creates a new Initiative instance and assigns the DTO
      const callArg = mockInitiativesRepository.create.mock.calls[0][0];
      expect(callArg).toBeInstanceOf(Initiative);
    });
  });

  describe('update', () => {
    it('should update an initiative', async () => {
      const updateDto = { title: 'Updated Init' };
      const updatedInitiative = { ...mockInitiative, ...updateDto };
      mockInitiativesRepository.findById.mockResolvedValue(mockInitiative);
      mockInitiativesRepository.update.mockResolvedValue(updatedInitiative);
      expect(await service.update('1', updateDto)).toBe(updatedInitiative);
      expect(mockInitiativesRepository.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should allow updating to INACTIVE when no active epics', async () => {
      const initiativeWithoutActiveEpics = {
        ...mockInitiative,
        epics: [{ status_text: 'INACTIVE' } as any],
      };
      const updateDto = { status_text: 'INACTIVE' };
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithoutActiveEpics as Initiative);
      mockInitiativesRepository.update.mockResolvedValue({
        ...initiativeWithoutActiveEpics,
        ...updateDto,
      } as Initiative);

      await service.update('1', updateDto);

      expect(mockInitiativesRepository.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw BadRequestException when trying to deactivate initiative with active epics', async () => {
      const initiativeWithActiveEpics = {
        ...mockInitiative,
        epics: [{ status_text: 'ACTIVE' } as any],
      };
      const updateDto = { status_text: 'INACTIVE' };
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithActiveEpics as Initiative);

      await expect(service.update('1', updateDto)).rejects.toThrow(BadRequestException);
      await expect(service.update('1', updateDto)).rejects.toThrow(
        'Cannot set initiative to INACTIVE because it has ACTIVE epics.',
      );
      expect(mockInitiativesRepository.update).not.toHaveBeenCalled();
    });

    it('should allow updating when status is not changing to INACTIVE', async () => {
      const updateDto = { title: 'Updated Title' };
      mockInitiativesRepository.findById.mockResolvedValue(mockInitiative);
      mockInitiativesRepository.update.mockResolvedValue({ ...mockInitiative, ...updateDto });

      await service.update('1', updateDto);

      expect(mockInitiativesRepository.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should handle update when epics is undefined', async () => {
      const initiativeWithoutEpics = { ...mockInitiative, epics: undefined } as any;
      const updateDto = { status_text: 'INACTIVE' };
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithoutEpics);
      mockInitiativesRepository.update.mockResolvedValue({
        ...initiativeWithoutEpics,
        ...updateDto,
      });

      await service.update('1', updateDto);

      expect(mockInitiativesRepository.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove an initiative without active epics', async () => {
      const initiativeWithoutActiveEpics = {
        ...mockInitiative,
        epics: [{ status_text: 'INACTIVE' } as any],
      };
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithoutActiveEpics as Initiative);
      mockInitiativesRepository.delete.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockInitiativesRepository.findById).toHaveBeenCalledWith('1');
      expect(mockInitiativesRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error when trying to delete initiative with active epics', async () => {
      const initiativeWithActiveEpics = {
        ...mockInitiative,
        epics: [{ status_text: 'ACTIVE' } as any],
      };
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithActiveEpics as Initiative);

      await expect(service.remove('1')).rejects.toThrow(
        'Cannot delete initiative with ACTIVE epics.',
      );
      expect(mockInitiativesRepository.delete).not.toHaveBeenCalled();
    });

    it('should delete initiative when epics array is empty', async () => {
      const initiativeWithoutEpics = { ...mockInitiative, epics: [] };
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithoutEpics);
      mockInitiativesRepository.delete.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockInitiativesRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should delete initiative when epics is undefined', async () => {
      const initiativeWithoutEpics = { ...mockInitiative, epics: undefined } as any;
      mockInitiativesRepository.findById.mockResolvedValue(initiativeWithoutEpics);
      mockInitiativesRepository.delete.mockResolvedValue(undefined);

      await service.remove('1');

      expect(mockInitiativesRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
