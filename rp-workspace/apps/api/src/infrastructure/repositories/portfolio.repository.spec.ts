import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioRepository } from './portfolio.repository';
import { Portfolio } from '@domain/entities/portfolio.entity';

describe('PortfolioRepository', () => {
  let repository: PortfolioRepository;
  let typeOrmRepository: jest.Mocked<Repository<Portfolio>>;

  const mockPortfolio: Portfolio = {
    portfolioId: 'portfolio-123',
    name: 'Test Portfolio',
    sponsorUserId: 'user-123',
  } as Portfolio;

  beforeEach(async () => {
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioRepository,
        {
          provide: getRepositoryToken(Portfolio),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<PortfolioRepository>(PortfolioRepository);
    typeOrmRepository = module.get(getRepositoryToken(Portfolio));
  });

  describe('findById', () => {
    it('should return portfolio with relations', async () => {
      typeOrmRepository.findOne.mockResolvedValue(mockPortfolio);

      const result = await repository.findById('portfolio-123');

      expect(result).toEqual(mockPortfolio);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { portfolioId: 'portfolio-123' },
        relations: ['sponsor', 'initiatives'],
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated portfolios', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPortfolio], 1]),
      };

      typeOrmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await repository.findAll({});

      expect(result).toEqual({ items: [mockPortfolio], total: 1 });
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('portfolio');
    });
  });

  describe('create', () => {
    it('should create portfolio', async () => {
      const portfolioData = {
        name: 'New Portfolio',
        sponsorUserId: 'user-123',
      };

      typeOrmRepository.create.mockReturnValue(mockPortfolio as Portfolio);
      typeOrmRepository.save.mockResolvedValue(mockPortfolio);

      const result = await repository.create(portfolioData);

      expect(result).toEqual(mockPortfolio);
      expect(typeOrmRepository.create).toHaveBeenCalledWith(portfolioData);
    });
  });

  describe('update', () => {
    it('should update portfolio', async () => {
      const updateData = { name: 'Updated Portfolio' };
      const updatedPortfolio = { ...mockPortfolio, ...updateData };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(updatedPortfolio);

      const result = await repository.update('portfolio-123', updateData);

      expect(result.name).toBe('Updated Portfolio');
      expect(typeOrmRepository.update).toHaveBeenCalledWith('portfolio-123', updateData);
    });

    it('should throw error when portfolio not found after update', async () => {
      const updateData = { name: 'Updated Portfolio' };

      typeOrmRepository.update.mockResolvedValue({ affected: 1 } as any);
      typeOrmRepository.findOne.mockResolvedValue(null);

      await expect(repository.update('portfolio-123', updateData)).rejects.toThrow(
        'Portfolio not found after update',
      );
    });
  });

  describe('delete', () => {
    it('should delete portfolio', async () => {
      typeOrmRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await repository.delete('portfolio-123');

      expect(typeOrmRepository.delete).toHaveBeenCalledWith('portfolio-123');
    });
  });
});
