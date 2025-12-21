import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with ID '${identifier}' not found`);
  }
}

export class RequirementNotFoundException extends EntityNotFoundException {
  constructor(requirementId: string) {
    super('Requirement', requirementId);
  }
}

export class SponsorNotFoundException extends EntityNotFoundException {
  constructor(sponsorId: string) {
    super('Sponsor', sponsorId);
  }
}

export class PortfolioNotFoundException extends EntityNotFoundException {
  constructor(portfolioId: string) {
    super('Portfolio', portfolioId);
  }
}

export class ProductNotFoundException extends EntityNotFoundException {
  constructor(productId: string) {
    super('Product', productId);
  }
}

export class EpicNotFoundException extends EntityNotFoundException {
  constructor(epicId: string) {
    super('Epic', epicId);
  }
}

export class InitiativeNotFoundException extends EntityNotFoundException {
  constructor(initiativeId: string) {
    super('Initiative', initiativeId);
  }
}

export class SprintNotFoundException extends EntityNotFoundException {
  constructor(sprintId: string) {
    super('Sprint', sprintId);
  }
}

export class ReleaseNotFoundException extends EntityNotFoundException {
  constructor(releaseId: string) {
    super('Release', releaseId);
  }
}
