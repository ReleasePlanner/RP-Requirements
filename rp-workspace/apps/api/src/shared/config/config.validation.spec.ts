import { configValidationSchema } from './config.validation';

describe('configValidationSchema', () => {
  it('should validate correct configuration', () => {
    const validConfig = {
      NODE_ENV: 'development',
      PORT: 3000,
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USERNAME: 'test',
      DB_PASSWORD: 'test',
      DB_DATABASE: 'test_db',
      DB_SYNCHRONIZE: false,
      DB_LOGGING: false,
      JWT_SECRET: 'a'.repeat(32),
      JWT_EXPIRES_IN: '1d',
      CORS_ORIGIN: '*',
      THROTTLE_TTL: 60,
      THROTTLE_LIMIT: 100,
      REQUEST_TIMEOUT: 30000,
      LOG_LEVEL: 'info',
    };

    const { error } = configValidationSchema.validate(validConfig);

    expect(error).toBeUndefined();
  });

  it('should use default values when not provided', () => {
    const minimalConfig = {
      DB_HOST: 'localhost',
      DB_USERNAME: 'test',
      DB_PASSWORD: 'test',
      DB_DATABASE: 'test_db',
      JWT_SECRET: 'a'.repeat(32),
    };

    const { value, error } = configValidationSchema.validate(minimalConfig);

    expect(error).toBeUndefined();
    expect(value.NODE_ENV).toBe('development');
    expect(value.PORT).toBe(3000);
    expect(value.DB_PORT).toBe(5432);
  });

  it('should reject invalid NODE_ENV', () => {
    const invalidConfig = {
      NODE_ENV: 'invalid',
      DB_HOST: 'localhost',
      DB_USERNAME: 'test',
      DB_PASSWORD: 'test',
      DB_DATABASE: 'test_db',
      JWT_SECRET: 'a'.repeat(32),
    };

    const { error } = configValidationSchema.validate(invalidConfig);

    expect(error).toBeDefined();
  });

  it('should reject JWT_SECRET shorter than 32 characters', () => {
    const invalidConfig = {
      DB_HOST: 'localhost',
      DB_USERNAME: 'test',
      DB_PASSWORD: 'test',
      DB_DATABASE: 'test_db',
      JWT_SECRET: 'short',
    };

    const { error } = configValidationSchema.validate(invalidConfig);

    expect(error).toBeDefined();
  });
});
