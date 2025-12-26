import { ApiPaginatedResponse } from './api-paginated-response.decorator';
import { applyDecorators } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../dto/pagination.dto';

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  applyDecorators: jest.fn(),
}));

jest.mock('@nestjs/swagger', () => ({
  ...jest.requireActual('@nestjs/swagger'),
  getSchemaPath: jest.fn((path) => `#/components/schemas/${path.name}`),
}));

describe('ApiPaginatedResponse', () => {
  class TestModel {}

  it('should apply decorators with correct schema', () => {
    ApiPaginatedResponse(TestModel);

    expect(applyDecorators).toHaveBeenCalled();
    expect(getSchemaPath).toHaveBeenCalledWith(PaginatedResponseDto);
    expect(getSchemaPath).toHaveBeenCalledWith(TestModel);
  });
});
