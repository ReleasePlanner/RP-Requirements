import {
  EntityNotFoundException,
  RequirementNotFoundException,
  UserNotFoundException,
  PortfolioNotFoundException,
  ProductNotFoundException,
  EpicNotFoundException,
  InitiativeNotFoundException,
  SprintNotFoundException,
  ReleaseNotFoundException,
} from './entity-not-found.exception';

describe('EntityNotFoundException', () => {
  describe('EntityNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new EntityNotFoundException('Entity', 'id-123');

      expect(exception.message).toBe("Entity with ID 'id-123' not found");
      expect(exception.getStatus()).toBe(404);
    });

    it('should create exception with numeric ID', () => {
      const exception = new EntityNotFoundException('Entity', 123);

      expect(exception.message).toBe("Entity with ID '123' not found");
    });
  });

  describe('RequirementNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new RequirementNotFoundException('req-123');

      expect(exception.message).toBe("Requirement with ID 'req-123' not found");
    });
  });

  describe('UserNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new UserNotFoundException('user-123');

      expect(exception.message).toBe("User with ID 'user-123' not found");
    });
  });

  describe('PortfolioNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new PortfolioNotFoundException('portfolio-123');

      expect(exception.message).toBe("Portfolio with ID 'portfolio-123' not found");
    });
  });

  describe('ProductNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new ProductNotFoundException('product-123');

      expect(exception.message).toBe("Product with ID 'product-123' not found");
    });
  });

  describe('EpicNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new EpicNotFoundException('epic-123');

      expect(exception.message).toBe("Epic with ID 'epic-123' not found");
    });
  });

  describe('InitiativeNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new InitiativeNotFoundException('initiative-123');

      expect(exception.message).toBe("Initiative with ID 'initiative-123' not found");
    });
  });

  describe('SprintNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new SprintNotFoundException('sprint-123');

      expect(exception.message).toBe("Sprint with ID 'sprint-123' not found");
    });
  });

  describe('ReleaseNotFoundException', () => {
    it('should create exception with correct message', () => {
      const exception = new ReleaseNotFoundException('release-123');

      expect(exception.message).toBe("Release with ID 'release-123' not found");
    });
  });
});
