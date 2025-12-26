import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRequirementRepository } from '@application/requirements/interfaces/repositories/requirement.repository.interface';
import { Requirement } from '@domain/entities/requirement.entity';
import { FindByEpicOptions } from '@shared/types/repository.types';

/**
 * Requirement Repository Implementation
 *
 * Handles data persistence for Requirement entities using TypeORM
 */
@Injectable()
export class RequirementRepository implements IRequirementRepository {
  constructor(
    @InjectRepository(Requirement)
    private readonly repository: Repository<Requirement>,
  ) {}

  /**
   * Finds all requirements with optional pagination and filtering
   *
   * @param options - Query options including pagination, sorting, and epic filters
   * @returns Paginated list of requirements with total count
   */
  async findAll(options?: FindByEpicOptions): Promise<{ items: Requirement[]; total: number }> {
    const query = this.repository
      .createQueryBuilder('req')
      .leftJoinAndSelect('req.priority', 'priority')
      .leftJoinAndSelect('req.status', 'status')
      .leftJoinAndSelect('req.type', 'type')
      .leftJoinAndSelect('req.complexity', 'complexity')
      .leftJoinAndSelect('req.source', 'source')
      .leftJoinAndSelect('req.effortType', 'effortType')
      .leftJoinAndSelect('req.riskLevel', 'riskLevel')
      .leftJoinAndSelect('req.metric', 'metric')
      .leftJoinAndSelect('req.verificationMethod', 'verificationMethod')
      .leftJoinAndSelect('req.epic', 'epic')
      .leftJoinAndSelect('req.productOwner', 'productOwner')
      .leftJoinAndSelect('req.approver', 'approver');

    if (options?.epicIds && options.epicIds.length > 0) {
      query.andWhere('req.epicId IN (:...epicIds)', { epicIds: options.epicIds });
    }

    if (options?.page && options?.limit) {
      query.skip((options.page - 1) * options.limit).take(options.limit);
    }

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async findById(id: string): Promise<Requirement | null> {
    return this.repository.findOne({
      where: { requirementId: id },
      relations: [
        'priority',
        'status',
        'type',
        'complexity',
        'source',
        'effortType',
        'riskLevel',
        'metric',
        'verificationMethod',
        'epic',
        'productOwner',
        'approver',
      ],
    });
  }

  async findByEpicId(epicId: string): Promise<Requirement[]> {
    return this.repository.find({
      where: { epicId },
      relations: [
        'priority',
        'status',
        'type',
        'complexity',
        'source',
        'effortType',
        'riskLevel',
        'metric',
        'verificationMethod',
        'epic',
        'productOwner',
        'approver',
      ],
    });
  }

  async create(data: Partial<Requirement>): Promise<Requirement> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<Requirement>): Promise<Requirement> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Requirement not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
