import { Epic } from '@domain/entities/epic.entity';

export interface IEpicsRepository {
  findAll(options?: { initiativeId?: string }): Promise<Epic[]>;
  findById(id: string): Promise<Epic | null>;
  create(epic: Epic): Promise<Epic>;
  update(id: string, epic: Partial<Epic>): Promise<Epic>;
  delete(id: string): Promise<void>;
}
