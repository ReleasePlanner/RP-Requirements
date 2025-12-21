import { BadRequestException } from '@nestjs/common';
import { UUIDValidationPipe } from './uuid-validation.pipe';
import { ArgumentMetadata } from '@nestjs/common';

describe('UUIDValidationPipe', () => {
  let pipe: UUIDValidationPipe;

  beforeEach(() => {
    pipe = new UUIDValidationPipe();
  });

  describe('transform', () => {
    it('should return valid UUID', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      const metadata: ArgumentMetadata = {
        type: 'param',
        data: 'id',
      };

      const result = pipe.transform(validUUID, metadata);

      expect(result).toBe(validUUID);
    });

    it('should throw BadRequestException for invalid UUID', () => {
      const invalidUUID = 'invalid-uuid';
      const metadata: ArgumentMetadata = {
        type: 'param',
        data: 'id',
      };

      expect(() => pipe.transform(invalidUUID, metadata)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty string', () => {
      const emptyString = '';
      const metadata: ArgumentMetadata = {
        type: 'param',
        data: 'id',
      };

      expect(() => pipe.transform(emptyString, metadata)).toThrow(BadRequestException);
    });
  });
});
