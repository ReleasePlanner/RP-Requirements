import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IInitiativesRepository } from '../interfaces/repositories/initiatives.repository.interface';
import { CreateInitiativeDto } from '../dtos/create-initiative.dto';
import { UpdateInitiativeDto } from '../dtos/update-initiative.dto';
import { Initiative } from '@domain/entities/initiative.entity';

/**
 * Initiatives Service
 *
 * Handles business logic for initiative management including CRUD operations
 */
@Injectable()
export class InitiativesService {
  constructor(
    @Inject('IInitiativesRepository')
    private readonly initiativesRepository: IInitiativesRepository,
  ) {}

  /**
   * Retrieves all initiatives with optional filtering by portfolio
   *
   * @param options - Query options including portfolio filter
   * @returns List of initiatives
   */
  async findAll(options?: { portfolioId?: string }): Promise<Initiative[]> {
    return this.initiativesRepository.findAll(options);
  }

  /**
   * Retrieves an initiative by ID
   *
   * @param id - Unique identifier of the initiative
   * @returns Initiative entity
   * @throws NotFoundException if initiative not found
   */
  async findOne(id: string): Promise<Initiative> {
    const initiative = await this.initiativesRepository.findById(id);
    if (!initiative) {
      throw new NotFoundException(`Initiative with ID ${id} not found`);
    }
    return initiative;
  }

  /**
   * Creates a new initiative
   *
   * @param createInitiativeDto - Data for creating the initiative
   * @returns Created initiative entity
   */
  async create(createInitiativeDto: CreateInitiativeDto): Promise<Initiative> {
    const initiative = new Initiative();
    Object.assign(initiative, createInitiativeDto);
    return this.initiativesRepository.create(initiative);
  }

  /**
   * Updates an existing initiative
   *
   * @param id - Unique identifier of the initiative to update
   * @param updateInitiativeDto - Data for updating the initiative
   * @returns Updated initiative entity
   * @throws BadRequestException if trying to set inactive with active epics
   */
  async update(id: string, updateInitiativeDto: UpdateInitiativeDto): Promise<Initiative> {
    const initiative = await this.findOne(id);

    // Check if trying to set status to INACTIVE
    const status =
      (updateInitiativeDto as Partial<Initiative>).status_text ||
      (updateInitiativeDto as Partial<Initiative>).status;

    if (status === 'INACTIVE') {
      const hasActiveEpics = initiative.epics?.some((e) => e.status_text === 'ACTIVE');
      if (hasActiveEpics) {
        throw new BadRequestException(
          'Cannot set initiative to INACTIVE because it has ACTIVE epics.',
        );
      }
    }

    return this.initiativesRepository.update(id, updateInitiativeDto);
  }

  async remove(id: string): Promise<void> {
    const initiative = await this.findOne(id);
    const hasActiveEpics = initiative.epics?.some((e) => e.status_text === 'ACTIVE');

    if (hasActiveEpics) {
      throw new Error('Cannot delete initiative with ACTIVE epics.');
    }

    return this.initiativesRepository.delete(id);
  }
}
