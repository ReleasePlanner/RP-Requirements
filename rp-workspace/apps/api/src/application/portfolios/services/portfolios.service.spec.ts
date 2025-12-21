import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosService } from './portfolios.service';
import { IPortfolioRepository } from '../interfaces/repositories/portfolio.repository.interface';
import { PortfolioNotFoundException } from '@shared/exceptions/entity-not-found.exception';
import { Portfolio } from '@domain/entities/portfolio.entity';

describe('PortfoliosService', () => {
  let service: PortfoliosService;
  let repository: jest.Mocked<IPortfolioRepository>;

  const mockPortfolio: Portfolio = {
    portfolioId: 'portfolio-123',
    name: 'Test Portfolio',
    sponsorUserId: 'user-123',
  } as Portfolio;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        {
          provide: 'IPortfolioRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PortfoliosService>(PortfoliosService);
    repository = module.get('IPortfolioRepository') as jest.Mocked<IPortfolioRepository>;
  });

  describe('findAll', () => {
    it('should return array of portfolios', async () => {
      repository.findAll.mockResolvedValue({ items: [mockPortfolio], total: 1 });

      const result = await service.findAll();

      expect(result).toEqual({ items: [mockPortfolio], total: 1 });
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return portfolio when found', async () => {
      repository.findById.mockResolvedValue(mockPortfolio);

      const result = await service.findOne('portfolio-123');

      expect(result).toEqual(mockPortfolio);
      expect(repository.findById).toHaveBeenCalledWith('portfolio-123');
    });

    it('should throw PortfolioNotFoundException when not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('portfolio-123')).rejects.toThrow(PortfolioNotFoundException);
    });
  });
});
