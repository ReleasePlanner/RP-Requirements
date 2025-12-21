import { PaginationDto, SortOrder, PaginatedResponseDto } from './pagination.dto';

describe('PaginationDto', () => {
  describe('default values', () => {
    it('should have default values', () => {
      const dto = new PaginationDto();

      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(10);
      expect(dto.sortOrder).toBe(SortOrder.DESC);
    });
  });

  describe('skip', () => {
    it('should calculate skip correctly', () => {
      const dto = new PaginationDto();
      dto.page = 2;
      dto.limit = 10;

      expect(dto.skip).toBe(10);
    });

    it('should calculate skip for first page', () => {
      const dto = new PaginationDto();
      dto.page = 1;
      dto.limit = 10;

      expect(dto.skip).toBe(0);
    });

    it('should calculate skip for page 3 with limit 5', () => {
      const dto = new PaginationDto();
      dto.page = 3;
      dto.limit = 5;

      expect(dto.skip).toBe(10);
    });
  });

  describe('take', () => {
    it('should return limit as take', () => {
      const dto = new PaginationDto();
      dto.limit = 20;

      expect(dto.take).toBe(20);
    });

    it('should return default limit when not set', () => {
      const dto = new PaginationDto();

      expect(dto.take).toBe(10);
    });
  });

  describe('sortOrder', () => {
    it('should accept ASC sort order', () => {
      const dto = new PaginationDto();
      dto.sortOrder = SortOrder.ASC;

      expect(dto.sortOrder).toBe(SortOrder.ASC);
    });

    it('should accept DESC sort order', () => {
      const dto = new PaginationDto();
      dto.sortOrder = SortOrder.DESC;

      expect(dto.sortOrder).toBe(SortOrder.DESC);
    });
  });
});

describe('PaginatedResponseDto', () => {
  describe('constructor', () => {
    it('should create paginated response with correct values', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const total = 20;
      const page = 1;
      const limit = 10;

      const response = new PaginatedResponseDto(data, total, page, limit);

      expect(response.data).toEqual(data);
      expect(response.total).toBe(total);
      expect(response.page).toBe(page);
      expect(response.limit).toBe(limit);
      expect(response.totalPages).toBe(2);
      expect(response.hasNextPage).toBe(true);
      expect(response.hasPreviousPage).toBe(false);
    });

    it('should calculate hasNextPage correctly', () => {
      const response = new PaginatedResponseDto([], 20, 1, 10);
      expect(response.hasNextPage).toBe(true);

      const responseLastPage = new PaginatedResponseDto([], 20, 2, 10);
      expect(responseLastPage.hasNextPage).toBe(false);
    });

    it('should calculate hasPreviousPage correctly', () => {
      const response = new PaginatedResponseDto([], 20, 1, 10);
      expect(response.hasPreviousPage).toBe(false);

      const responsePage2 = new PaginatedResponseDto([], 20, 2, 10);
      expect(responsePage2.hasPreviousPage).toBe(true);
    });

    it('should calculate totalPages correctly', () => {
      const response = new PaginatedResponseDto([], 25, 1, 10);
      expect(response.totalPages).toBe(3); // Math.ceil(25/10) = 3

      const responseExact = new PaginatedResponseDto([], 20, 1, 10);
      expect(responseExact.totalPages).toBe(2);
    });
  });
});
