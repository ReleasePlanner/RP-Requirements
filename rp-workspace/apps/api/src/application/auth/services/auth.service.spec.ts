import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { ISponsorRepository } from '../interfaces/repositories/sponsor.repository.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Sponsor } from '@domain/entities/sponsor.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let sponsorRepository: jest.Mocked<ISponsorRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockSponsor: Sponsor = {
    sponsorId: 'sponsor-123',
    name: 'Test Sponsor',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'Sponsor',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Sponsor;

  beforeEach(async () => {
    const mockSponsorRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'ISponsorRepository',
          useValue: mockSponsorRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    sponsorRepository = module.get('ISponsorRepository') as jest.Mocked<ISponsorRepository>;
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);

    configService.get.mockReturnValue('1d');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return sponsor when credentials are valid', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeDefined();
      expect(result.sponsorId).toBe(mockSponsor.sponsorId);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException when sponsor not found', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when sponsor is inactive', async () => {
      const inactiveSponsor = { ...mockSponsor, isActive: false };
      sponsorRepository.findByEmail.mockResolvedValue(inactiveSponsor);

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return auth response with token', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken', 'jwt-token');
      expect(result).toHaveProperty('tokenType', 'Bearer');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(mockSponsor.email);
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should parse expiresIn correctly for days', () => {
      configService.get.mockReturnValue('2d');
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      return service.login(loginDto).then((result) => {
        expect(result.expiresIn).toBe(172800); // 2 days in seconds
      });
    });

    it('should parse expiresIn correctly for hours', () => {
      configService.get.mockReturnValue('2h');
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      return service.login(loginDto).then((result) => {
        expect(result.expiresIn).toBe(7200); // 2 hours in seconds
      });
    });

    it('should parse expiresIn correctly for minutes', () => {
      configService.get.mockReturnValue('30m');
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      return service.login(loginDto).then((result) => {
        expect(result.expiresIn).toBe(1800); // 30 minutes in seconds
      });
    });

    it('should parse expiresIn correctly for seconds', () => {
      configService.get.mockReturnValue('3600s');
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      return service.login(loginDto).then((result) => {
        expect(result.expiresIn).toBe(3600);
      });
    });

    it('should use default expiresIn when format is unknown', () => {
      configService.get.mockReturnValue('unknown');
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt-token');

      return service.login(loginDto).then((result) => {
        expect(result.expiresIn).toBe(86400); // Default 1 day
      });
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'New Sponsor',
      email: 'new@example.com',
      password: 'Password123!',
      role: 'Sponsor',
    };

    it('should create sponsor and return auth response', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      sponsorRepository.create.mockResolvedValue({
        ...mockSponsor,
        ...registerDto,
        password: 'hashedPassword',
      });
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(sponsorRepository.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should throw ConflictException when email already exists', async () => {
      sponsorRepository.findByEmail.mockResolvedValue(mockSponsor);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should use default role when not provided', async () => {
      const registerDtoWithoutRole: RegisterDto = {
        name: 'New Sponsor',
        email: 'new@example.com',
        password: 'Password123!',
      };

      sponsorRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      sponsorRepository.create.mockResolvedValue({
        ...mockSponsor,
        ...registerDtoWithoutRole,
        role: 'User', // Default role likely User if logic follows service
        password: 'hashedPassword',
      });
      jwtService.sign.mockReturnValue('jwt-token');

      await service.register(registerDtoWithoutRole);

      expect(sponsorRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'User',
        }),
      );
    });
  });
});
