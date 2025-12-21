import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './database.config';

describe('databaseConfig', () => {
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as any;
  });

  it('should return TypeORM configuration', () => {
    configService.get.mockImplementation((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'test',
        DB_PASSWORD: 'test',
        DB_DATABASE: 'test_db',
        DB_SYNCHRONIZE: false,
        DB_LOGGING: false,
        NODE_ENV: 'development',
      };
      return config[key] ?? defaultValue;
    });

    const config = databaseConfig(configService);

    expect(config).toHaveProperty('type', 'postgres');
    expect(config).toHaveProperty('host', 'localhost');
    expect((config as any).port).toBe(5432);
    expect(config).toHaveProperty('username', 'test');
    expect(config).toHaveProperty('password', 'test');
    expect(config).toHaveProperty('database', 'test_db');
    expect(config).toHaveProperty('synchronize', false);
    expect(config).toHaveProperty('logging', false);
    expect((config as any).ssl).toBe(false);
  });

  it('should enable SSL in production', () => {
    configService.get.mockImplementation((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USERNAME: 'test',
        DB_PASSWORD: 'test',
        DB_DATABASE: 'test_db',
        DB_SYNCHRONIZE: false,
        DB_LOGGING: false,
        NODE_ENV: 'production',
      };
      return config[key] ?? defaultValue;
    });

    const config = databaseConfig(configService);

    expect((config as any).ssl).toEqual({ rejectUnauthorized: false });
  });

  it('should use default port when not provided', () => {
    configService.get.mockImplementation((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        DB_HOST: 'localhost',
        DB_USERNAME: 'test',
        DB_PASSWORD: 'test',
        DB_DATABASE: 'test_db',
        NODE_ENV: 'development',
      };
      return config[key] ?? defaultValue;
    });

    const config = databaseConfig(configService);

    expect((config as any).port).toBe(5432);
  });
});
