import { Injectable, Inject } from '@nestjs/common';
import { IRequirementRepository } from '../interfaces/repositories/requirement.repository.interface';
import { Requirement } from '@domain/entities/requirement.entity';
import { CreateRequirementDto } from '../dto/create-requirement.dto';
import { UpdateRequirementDto } from '../dto/update-requirement.dto';
import { RequirementNotFoundException } from '@shared/exceptions/entity-not-found.exception';
import { FindByEpicOptions } from '@shared/types/repository.types';

/**
 * Requirements Service
 *
 * Handles business logic for requirement management including CRUD operations
 */
@Injectable()
export class RequirementsService {
  constructor(
    @Inject('IRequirementRepository')
    private readonly requirementRepository: IRequirementRepository,
  ) {}

  /**
   * Retrieves all requirements with optional pagination and filtering
   *
   * @param options - Query options including pagination, sorting, and epic filters
   * @returns Paginated list of requirements with total count
   */
  async findAll(options?: FindByEpicOptions): Promise<{ items: Requirement[]; total: number }> {
    return this.requirementRepository.findAll(options);
  }

  /**
   * Retrieves a requirement by ID
   *
   * @param requirementId - Unique identifier of the requirement
   * @returns Requirement entity
   * @throws RequirementNotFoundException if requirement not found
   */
  async findOne(requirementId: string): Promise<Requirement> {
    const requirement = await this.requirementRepository.findById(requirementId);
    if (!requirement) {
      throw new RequirementNotFoundException(requirementId);
    }
    return requirement;
  }

  /**
   * Retrieves all requirements for a specific epic
   *
   * @param epicId - Unique identifier of the epic
   * @returns List of requirements for the epic
   */
  async findByEpicId(epicId: string): Promise<Requirement[]> {
    return this.requirementRepository.findByEpicId(epicId);
  }

  /**
   * Creates a new requirement
   *
   * @param createDto - Data for creating the requirement
   * @returns Created requirement entity
   */
  async create(createDto: CreateRequirementDto): Promise<Requirement> {
    return this.requirementRepository.create(createDto);
  }

  /**
   * Updates an existing requirement
   *
   * @param requirementId - Unique identifier of the requirement to update
   * @param updateDto - Data for updating the requirement
   * @returns Updated requirement entity
   * @throws RequirementNotFoundException if requirement not found
   */
  async update(requirementId: string, updateDto: UpdateRequirementDto): Promise<Requirement> {
    await this.findOne(requirementId);
    return this.requirementRepository.update(requirementId, updateDto);
  }

  /**
   * Deletes a requirement by ID
   *
   * @param requirementId - Unique identifier of the requirement to delete
   * @throws RequirementNotFoundException if requirement not found
   */
  async delete(requirementId: string): Promise<void> {
    await this.findOne(requirementId);
    await this.requirementRepository.delete(requirementId);
  }
}
