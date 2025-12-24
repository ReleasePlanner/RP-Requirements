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

  describe('findAll', () => {
    it('should return paginated portfolios', async () => {
      const resultData = { items: [mockPortfolio], total: 1 };
      service.findAll.mockResolvedValue(resultData);

      const result = await controller.findAll();

      expect(result).toEqual(resultData);
      expect(service.findAll).toHaveBeenCalled();
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
});
