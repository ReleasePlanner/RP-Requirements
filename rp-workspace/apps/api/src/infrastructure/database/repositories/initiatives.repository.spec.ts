import { Test, TestingModule } from '@nestjs/testing';
import { InitiativesRepository } from './initiatives.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Initiative } from '@domain/entities/initiative.entity';
import { Repository } from 'typeorm';

const mockTypeOrmRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('InitiativesRepository', () => {
  let repository: InitiativesRepository;
  let typeOrmRepository: Repository<Initiative>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InitiativesRepository,
        {
          provide: getRepositoryToken(Initiative),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<InitiativesRepository>(InitiativesRepository);
    typeOrmRepository = module.get<Repository<Initiative>>(getRepositoryToken(Initiative));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all initiatives', async () => {
      const result = [new Initiative()];
      mockTypeOrmRepository.find.mockResolvedValue(result);
      expect(await repository.findAll()).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return one initiative', async () => {
      const result = new Initiative();
      mockTypeOrmRepository.findOne.mockResolvedValue(result);
      expect(await repository.findById('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should save an initiative', async () => {
      const initiative = new Initiative();
      mockTypeOrmRepository.save.mockResolvedValue(initiative);
      expect(await repository.create(initiative)).toBe(initiative);
    });
  });

  describe('update', () => {
    it('should update an initiative', async () => {
      const initiative = new Initiative();
      mockTypeOrmRepository.update.mockResolvedValue(undefined);
      mockTypeOrmRepository.findOne.mockResolvedValue(initiative);
      expect(await repository.update('1', {})).toBe(initiative);
    });
  });

  describe('delete', () => {
    it('should delete an initiative', async () => {
      mockTypeOrmRepository.delete.mockResolvedValue(undefined);
      await repository.delete('1');
      expect(mockTypeOrmRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
