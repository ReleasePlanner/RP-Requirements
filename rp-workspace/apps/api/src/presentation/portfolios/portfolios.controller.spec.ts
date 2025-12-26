import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from '@application/portfolios/services/portfolios.service';
import { Portfolio } from '@domain/entities/portfolio.entity';

describe('PortfoliosController', () => {
  let controller: PortfoliosController;
  let service: jest.Mocked<PortfoliosService>;

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
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfoliosController],
      providers: [
        {
          provide: PortfoliosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PortfoliosController>(PortfoliosController);
    service = module.get(PortfoliosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('test', () => {
    it('should return test response', async () => {
      const result = await controller.test();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated portfolios', async () => {
      const resultData = { items: [mockPortfolio], total: 1 };
      service.findAll.mockResolvedValue(resultData);

      const result = await controller.findAll();

      expect(result).toEqual(resultData);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should pass query parameters to service', async () => {
      const resultData = { items: [mockPortfolio], total: 1 };
      service.findAll.mockResolvedValue(resultData);

      await controller.findAll(1, 10, 'name', 'ASC');

      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'ASC',
      });
    });

    it('should handle undefined query parameters', async () => {
      const resultData = { items: [mockPortfolio], total: 1 };
      service.findAll.mockResolvedValue(resultData);

      await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('should return portfolio by id', async () => {
      service.findOne.mockResolvedValue(mockPortfolio);

      const result = await controller.findOne('portfolio-123');

      expect(result).toEqual(mockPortfolio);
      expect(service.findOne).toHaveBeenCalledWith('portfolio-123');
    });
  });

  describe('create', () => {
    it('should create a portfolio', async () => {
      const createDto = { name: 'New Portfolio', sponsorId: 'sponsor-123' };
      const createdPortfolio = { ...mockPortfolio, ...createDto };
      service.create.mockResolvedValue(createdPortfolio);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(createdPortfolio);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a portfolio', async () => {
      const updateDto = { name: 'Updated Portfolio' };
      const updatedPortfolio = { ...mockPortfolio, ...updateDto };
      service.update.mockResolvedValue(updatedPortfolio);

      const result = await controller.update('portfolio-123', updateDto as any);

      expect(result).toEqual(updatedPortfolio);
      expect(service.update).toHaveBeenCalledWith('portfolio-123', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a portfolio', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('portfolio-123');

      expect(service.remove).toHaveBeenCalledWith('portfolio-123');
    });
  });
});
