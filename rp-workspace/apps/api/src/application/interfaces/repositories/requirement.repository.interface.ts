import { Requirement } from '@domain/entities/requirement.entity';

export interface IRequirementRepository {
  findById(requirementId: string): Promise<Requirement | null>;
  findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ items: Requirement[]; total: number }>;
  findByEpicId(epicId: string): Promise<Requirement[]>;
  create(requirement: Partial<Requirement>): Promise<Requirement>;
  update(requirementId: string, requirement: Partial<Requirement>): Promise<Requirement>;
  delete(requirementId: string): Promise<void>;
}
