import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IEpicsRepository } from '@application/epics/interfaces/repositories/epics.repository.interface';
import { Epic } from '@domain/entities/epic.entity';
import { WhereClause } from '@shared/types/repository.types';

/**
 * Epics Repository Implementation
 * 
 * Handles data persistence for Epic entities using TypeORM
 */
@Injectable()
export class EpicsRepository implements IEpicsRepository {
  constructor(
    @InjectRepository(Epic)
    private readonly epicRepository: Repository<Epic>,
  ) { }

  /**
   * Finds all epics with optional filtering by initiative
   * 
   * @param options - Query options including initiative filter
   * @returns List of epics
   */
  async findAll(options?: { initiativeId?: string }): Promise<Epic[]> {
    const where: WhereClause = {};
    if (options?.initiativeId) {
      where.initiative = { initiativeId: options.initiativeId };
    }
    return this.epicRepository.find({
      where,
      relations: ['status', 'initiative'],
    });
  }

  async findById(id: string): Promise<Epic | null> {
    return this.epicRepository.findOne({
      where: { epicId: id },
      relations: ['status', 'initiative', 'requirements'],
    });
  }

  async create(epic: Epic): Promise<Epic> {
    return this.epicRepository.save(epic);
  }

  async update(id: string, epic: Partial<Epic>): Promise<Epic> {
    await this.epicRepository.update(id, epic);
    return this.findById(id) as Promise<Epic>;
  }

  async delete(id: string): Promise<void> {
    await this.epicRepository.delete(id);
  }
}
