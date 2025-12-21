import { Injectable, Inject } from '@nestjs/common';
import { IRequirementRepository } from '../interfaces/repositories/requirement.repository.interface';
import { Requirement } from '@domain/entities/requirement.entity';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';
import { RequirementNotFoundException } from '@shared/exceptions/entity-not-found.exception';

@Injectable()
export class RequirementsService {
  constructor(
    @Inject('IRequirementRepository')
    private readonly requirementRepository: IRequirementRepository,
  ) { }

  async findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    epicIds?: string[];
  }): Promise<{ items: Requirement[]; total: number }> {
    return this.requirementRepository.findAll(options);
  }

  async findOne(requirementId: string): Promise<Requirement> {
    const requirement = await this.requirementRepository.findById(requirementId);
    if (!requirement) {
      throw new RequirementNotFoundException(requirementId);
    }
    return requirement;
  }

  async findByEpicId(epicId: string): Promise<Requirement[]> {
    return this.requirementRepository.findByEpicId(epicId);
  }

  async create(createDto: CreateRequirementDto): Promise<Requirement> {
    return this.requirementRepository.create(createDto);
  }

  async update(requirementId: string, updateDto: UpdateRequirementDto): Promise<Requirement> {
    await this.findOne(requirementId); // Verify exists
    return this.requirementRepository.update(requirementId, updateDto);
  }

  async delete(requirementId: string): Promise<void> {
    await this.findOne(requirementId); // Verify exists
    await this.requirementRepository.delete(requirementId);
  }
}
