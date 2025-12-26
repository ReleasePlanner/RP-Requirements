import { Injectable, Inject } from '@nestjs/common';
import { IPortfolioRepository } from '../interfaces/repositories/portfolio.repository.interface';
import { Portfolio } from '@domain/entities/portfolio.entity';
import { PortfolioNotFoundException } from '@shared/exceptions/entity-not-found.exception';

@Injectable()
export class PortfoliosService {
  constructor(
    @Inject('IPortfolioRepository')
    private readonly portfolioRepository: IPortfolioRepository,
  ) {}

  async findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ items: Portfolio[]; total: number }> {
    return this.portfolioRepository.findAll(options);
  }

  async findOne(portfolioId: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);
    if (!portfolio) {
      throw new PortfolioNotFoundException(portfolioId);
    }
    return portfolio;
  }

  async create(data: Partial<Portfolio>): Promise<Portfolio> {
    return this.portfolioRepository.create(data);
  }

  async update(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    const portfolio = await this.findOne(id);

    // Validation: Cannot deactivate if active initiatives exist
    if (data.status === 'INACTIVE' && portfolio.status !== 'INACTIVE') {
      const hasActiveInitiatives = portfolio.initiatives?.some((i) => i.status_text === 'ACTIVE');
      if (hasActiveInitiatives) {
        throw new Error('Cannot set portfolio to INACTIVE because it has ACTIVE initiatives.');
      }
    }

    return this.portfolioRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    const portfolio = await this.findOne(id);
    const hasActiveInitiatives = portfolio.initiatives?.some((i) => i.status_text === 'ACTIVE');

    if (hasActiveInitiatives) {
      // Using BadRequestException directly as it maps to 400
      throw new Error('Cannot delete portfolio with ACTIVE initiatives.');
    }

    return this.portfolioRepository.delete(id);
  }
}
