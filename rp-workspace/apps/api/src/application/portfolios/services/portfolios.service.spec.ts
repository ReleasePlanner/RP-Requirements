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
    sponsorId: 'sponsor-123',
    creationDate: new Date(),
    status: 'Active',
    sponsor: null as any,
    initiatives: [],
  } as Portfolio;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of portfolios', async () => {
      repository.findAll.mockResolvedValue({ items: [mockPortfolio], total: 1 });

      const result = await service.findAll();

      expect(result).toEqual({ items: [mockPortfolio], total: 1 });
      expect(repository.findAll).toHaveBeenCalled();
    });

    it('should pass options to repository', async () => {
      const options = { page: 1, limit: 10, sortBy: 'name', sortOrder: 'ASC' as const };
      repository.findAll.mockResolvedValue({ items: [mockPortfolio], total: 1 });

      await service.findAll(options);

      expect(repository.findAll).toHaveBeenCalledWith(options);
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

  describe('create', () => {
    it('should create a portfolio', async () => {
      const data = { name: 'New Portfolio', sponsorId: 'sponsor-123' };
      const createdPortfolio = { ...mockPortfolio, ...data };
      repository.create.mockResolvedValue(createdPortfolio);

      const result = await service.create(data);

      expect(result).toEqual(createdPortfolio);
      expect(repository.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    it('should update a portfolio', async () => {
      const data = { name: 'Updated Portfolio' };
      const updatedPortfolio = { ...mockPortfolio, ...data };
      repository.findById.mockResolvedValue(mockPortfolio);
      repository.update.mockResolvedValue(updatedPortfolio);

      const result = await service.update('portfolio-123', data);

      expect(result).toEqual(updatedPortfolio);
      expect(repository.findById).toHaveBeenCalledWith('portfolio-123');
      expect(repository.update).toHaveBeenCalledWith('portfolio-123', data);
    });

    it('should allow updating to INACTIVE when no active initiatives', async () => {
      const portfolioWithoutActiveInitiatives = {
        ...mockPortfolio,
        initiatives: [{ status_text: 'INACTIVE' } as any],
      };
      const data = { status: 'INACTIVE' };
      repository.findById.mockResolvedValue(portfolioWithoutActiveInitiatives as Portfolio);
      repository.update.mockResolvedValue({ ...portfolioWithoutActiveInitiatives, ...data } as Portfolio);

      await service.update('portfolio-123', data);

      expect(repository.update).toHaveBeenCalledWith('portfolio-123', data);
    });

    it('should throw error when trying to deactivate portfolio with active initiatives', async () => {
      const portfolioWithActiveInitiatives = {
        ...mockPortfolio,
        initiatives: [{ status_text: 'ACTIVE' } as any],
      };
      const data = { status: 'INACTIVE' };
      repository.findById.mockResolvedValue(portfolioWithActiveInitiatives as Portfolio);

      await expect(service.update('portfolio-123', data)).rejects.toThrow(
        'Cannot set portfolio to INACTIVE because it has ACTIVE initiatives.',
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should allow updating when status is not changing to INACTIVE', async () => {
      const data = { name: 'Updated Name' };
      repository.findById.mockResolvedValue(mockPortfolio);
      repository.update.mockResolvedValue({ ...mockPortfolio, ...data });

      await service.update('portfolio-123', data);

      expect(repository.update).toHaveBeenCalledWith('portfolio-123', data);
    });

    it('should allow updating to INACTIVE when portfolio is already INACTIVE', async () => {
      const inactivePortfolio = { ...mockPortfolio, status: 'INACTIVE' };
      const data = { status: 'INACTIVE' };
      repository.findById.mockResolvedValue(inactivePortfolio);
      repository.update.mockResolvedValue(inactivePortfolio);

      await service.update('portfolio-123', data);

      expect(repository.update).toHaveBeenCalledWith('portfolio-123', data);
    });
  });

  describe('remove', () => {
    it('should delete a portfolio without active initiatives', async () => {
      const portfolioWithoutActiveInitiatives = {
        ...mockPortfolio,
        initiatives: [{ status_text: 'INACTIVE' } as any],
      };
      repository.findById.mockResolvedValue(portfolioWithoutActiveInitiatives as Portfolio);
      repository.delete.mockResolvedValue(undefined);

      await service.remove('portfolio-123');

      expect(repository.findById).toHaveBeenCalledWith('portfolio-123');
      expect(repository.delete).toHaveBeenCalledWith('portfolio-123');
    });

    it('should throw error when trying to delete portfolio with active initiatives', async () => {
      const portfolioWithActiveInitiatives = {
        ...mockPortfolio,
        initiatives: [{ status_text: 'ACTIVE' } as any],
      };
      repository.findById.mockResolvedValue(portfolioWithActiveInitiatives as Portfolio);

      await expect(service.remove('portfolio-123')).rejects.toThrow(
        'Cannot delete portfolio with ACTIVE initiatives.',
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should delete portfolio when initiatives array is empty', async () => {
      const portfolioWithoutInitiatives = { ...mockPortfolio, initiatives: [] };
      repository.findById.mockResolvedValue(portfolioWithoutInitiatives);
      repository.delete.mockResolvedValue(undefined);

      await service.remove('portfolio-123');

      expect(repository.delete).toHaveBeenCalledWith('portfolio-123');
    });

    it('should delete portfolio when initiatives is undefined', async () => {
      const portfolioWithoutInitiatives = { ...mockPortfolio, initiatives: undefined } as any;
      repository.findById.mockResolvedValue(portfolioWithoutInitiatives);
      repository.delete.mockResolvedValue(undefined);

      await service.remove('portfolio-123');

      expect(repository.delete).toHaveBeenCalledWith('portfolio-123');
    });
  });
});
