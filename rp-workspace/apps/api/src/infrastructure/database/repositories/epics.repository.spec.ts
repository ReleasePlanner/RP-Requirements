import { Test, TestingModule } from '@nestjs/testing';
import { EpicsRepository } from './epics.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Epic } from '@domain/entities/epic.entity';
import { Repository } from 'typeorm';

const mockTypeOrmRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('EpicsRepository', () => {
  let repository: EpicsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpicsRepository,
        {
          provide: getRepositoryToken(Epic),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<EpicsRepository>(EpicsRepository);
    typeOrmRepository = module.get<Repository<Epic>>(getRepositoryToken(Epic));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all epics', async () => {
      const result = [new Epic()];
      mockTypeOrmRepository.find.mockResolvedValue(result);
      expect(await repository.findAll()).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return one epic', async () => {
      const result = new Epic();
      mockTypeOrmRepository.findOne.mockResolvedValue(result);
      expect(await repository.findById('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should save an epic', async () => {
      const epic = new Epic();
      mockTypeOrmRepository.save.mockResolvedValue(epic);
      expect(await repository.create(epic)).toBe(epic);
    });
  });

  describe('update', () => {
    it('should update an epic', async () => {
      const epic = new Epic();
      mockTypeOrmRepository.update.mockResolvedValue(undefined);
      mockTypeOrmRepository.findOne.mockResolvedValue(epic);
      expect(await repository.update('1', {})).toBe(epic);
    });
  });

  describe('delete', () => {
    it('should delete an epic', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue(undefined);
      await repository.delete('1');
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
