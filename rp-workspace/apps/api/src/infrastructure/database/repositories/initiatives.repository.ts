import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IInitiativesRepository } from '@application/initiatives/interfaces/repositories/initiatives.repository.interface';
import { Initiative } from '@domain/entities/initiative.entity';

@Injectable()
export class InitiativesRepository implements IInitiativesRepository {
  constructor(
    @InjectRepository(Initiative)
    private readonly initiativeRepository: Repository<Initiative>,
  ) { }

  async findAll(options?: { portfolioId?: string }): Promise<Initiative[]> {
    const where: any = {};
    if (options?.portfolioId) {
      where.portfolio = { portfolioId: options.portfolioId };
    }
    return this.initiativeRepository.find({
      where,
      relations: ['status', 'portfolio'],
    });
  }

  async findById(id: string): Promise<Initiative | null> {
    return this.initiativeRepository.findOne({
      where: { initiativeId: id },
      relations: ['status', 'portfolio', 'epics'],
    });
  }

  async create(initiative: Initiative): Promise<Initiative> {
    return this.initiativeRepository.save(initiative);
  }

  async update(id: string, initiative: Partial<Initiative>): Promise<Initiative> {
    await this.initiativeRepository.update(id, initiative);
    return this.findById(id) as Promise<Initiative>;
  }

  async delete(id: string): Promise<void> {
    await this.initiativeRepository.delete(id);
  }
}
