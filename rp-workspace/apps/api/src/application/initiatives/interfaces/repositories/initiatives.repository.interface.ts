import { Initiative } from '@domain/entities/initiative.entity';

export interface IInitiativesRepository {
  findAll(options?: { portfolioId?: string }): Promise<Initiative[]>;
  findById(id: string): Promise<Initiative | null>;
  create(initiative: Initiative): Promise<Initiative>;
  update(id: string, initiative: Partial<Initiative>): Promise<Initiative>;
  delete(id: string): Promise<void>;
}
