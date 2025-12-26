import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IEpicsRepository } from '../interfaces/repositories/epics.repository.interface';
import { CreateEpicDto } from '../dtos/create-epic.dto';
import { UpdateEpicDto } from '../dtos/update-epic.dto';
import { Epic } from '@domain/entities/epic.entity';

@Injectable()
export class EpicsService {
  constructor(
    @Inject('IEpicsRepository')
    private readonly epicsRepository: IEpicsRepository,
  ) {}

  async findAll(options?: { initiativeId?: string }): Promise<Epic[]> {
    return this.epicsRepository.findAll(options);
  }

  async findOne(id: string): Promise<Epic> {
    const epic = await this.epicsRepository.findById(id);
    if (!epic) {
      throw new NotFoundException(`Epic with ID ${id} not found`);
    }
    return epic;
  }

  async create(createEpicDto: CreateEpicDto): Promise<Epic> {
    const epic = new Epic();
    Object.assign(epic, createEpicDto);
    return this.epicsRepository.create(epic);
  }

  async update(id: string, updateEpicDto: UpdateEpicDto): Promise<Epic> {
    await this.findOne(id); // Ensure exists
    return this.epicsRepository.update(id, updateEpicDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Ensure exists
    return this.epicsRepository.delete(id);
  }
}
