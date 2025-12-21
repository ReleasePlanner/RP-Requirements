import { Test, TestingModule } from '@nestjs/testing';
import { SponsorsController } from './sponsors.controller';
import { SponsorsService } from '@application/sponsors/services/sponsors.service';
import { Sponsor } from '@domain/entities/sponsor.entity';

describe('SponsorsController', () => {
  let controller: SponsorsController;
  let service: jest.Mocked<SponsorsService>;

  const mockSponsor: Sponsor = {
    sponsorId: 'sponsor-123',
    name: 'Test Sponsor',
    email: 'test@example.com',
    role: 'Sponsor',
    isActive: true,
  } as Sponsor;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SponsorsController],
      providers: [
        {
          provide: SponsorsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SponsorsController>(SponsorsController);
    service = module.get(SponsorsService);
  });

  describe('findAll', () => {
    it('should return array of sponsors', async () => {
      service.findAll.mockResolvedValue([mockSponsor]);

      const result = await controller.findAll();

      expect(result).toEqual([mockSponsor]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return sponsor by id', async () => {
      service.findOne.mockResolvedValue(mockSponsor);

      const result = await controller.findOne('sponsor-123');

      expect(result).toEqual(mockSponsor);
      expect(service.findOne).toHaveBeenCalledWith('sponsor-123');
    });
  });
});
