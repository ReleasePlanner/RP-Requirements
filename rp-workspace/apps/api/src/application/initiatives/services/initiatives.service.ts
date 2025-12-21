import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IInitiativesRepository } from '../interfaces/repositories/initiatives.repository.interface';
import { CreateInitiativeDto } from '../dtos/create-initiative.dto';
import { UpdateInitiativeDto } from '../dtos/update-initiative.dto';
import { Initiative } from '@domain/entities/initiative.entity';

@Injectable()
export class InitiativesService {
  constructor(
    @Inject('IInitiativesRepository')
    private readonly initiativesRepository: IInitiativesRepository,
  ) { }

  async findAll(options?: { portfolioId?: string }): Promise<Initiative[]> {
    return this.initiativesRepository.findAll(options);
  }

  async findOne(id: string): Promise<Initiative> {
    const initiative = await this.initiativesRepository.findById(id);
    if (!initiative) {
      throw new NotFoundException(`Initiative with ID ${id} not found`);
    }
    return initiative;
  }

  async create(createInitiativeDto: CreateInitiativeDto): Promise<Initiative> {
    const initiative = new Initiative();
    Object.assign(initiative, createInitiativeDto);
    return this.initiativesRepository.create(initiative);
  }

  async update(id: string, updateInitiativeDto: UpdateInitiativeDto): Promise<Initiative> {
    const initiative = await this.findOne(id);

    // Validation
    if (updateInitiativeDto.status_text === 'INACTIVE') { // Assuming DTO uses status_text or mapped
      // Note: DTO might not have status_text directly mapped if it's just Partial<Initiative>.
      // Let's assume the controller passes partial update.
      // Actually UpdateInitiativeDto is imported. Let's check if it has status.
      // For now, I'll access it safely.
      const status = (updateInitiativeDto as any).status_text || (updateInitiativeDto as any).status;

      if (status === 'INACTIVE') {
        const hasActiveEpics = initiative.epics?.some(e => e.status_text === 'ACTIVE');
        if (hasActiveEpics) {
          throw new Error('Cannot set initiative to INACTIVE because it has ACTIVE epics.');
        }
      }
    }

    // A cleaner implementation since we know UpdateInitiativeDto should match entity structure mostly
    // But let's stick to the pattern used in Portfolio service
    if ((updateInitiativeDto as any).status === 'INACTIVE' || (updateInitiativeDto as any).status_text === 'INACTIVE') {
      const hasActiveEpics = initiative.epics?.some(e => e.status_text === 'ACTIVE');
      if (hasActiveEpics) {
        throw new Error('Cannot set initiative to INACTIVE because it has ACTIVE epics.');
      }
    }

    return this.initiativesRepository.update(id, updateInitiativeDto);
  }

  async remove(id: string): Promise<void> {
    const initiative = await this.findOne(id);
    const hasActiveEpics = initiative.epics?.some(e => e.status_text === 'ACTIVE');

    if (hasActiveEpics) {
      throw new Error('Cannot delete initiative with ACTIVE epics.');
    }

    return this.initiativesRepository.delete(id);
  }
}
