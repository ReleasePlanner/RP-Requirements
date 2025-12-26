import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from '@domain/entities/portfolio.entity';
import { IPortfolioRepository } from '@application/interfaces/repositories/portfolio.repository.interface';

@Injectable()
export class PortfolioRepository implements IPortfolioRepository {
  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>,
  ) {}

  async findById(portfolioId: string): Promise<Portfolio | null> {
    return this.repository.findOne({
      where: { portfolioId },
      relations: ['sponsor', 'initiatives'],
    });
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ items: Portfolio[]; total: number }> {
    const { page, limit, sortBy, sortOrder } = options || {};

    const query = this.repository
      .createQueryBuilder('portfolio')
      .leftJoinAndSelect('portfolio.initiatives', 'initiatives')
      .leftJoinAndSelect('portfolio.sponsor', 'sponsor');

    if (sortBy) {
      if (sortBy === 'sponsor') {
        query.orderBy('sponsor.name', sortOrder || 'ASC');
      } else if (sortBy.includes('.')) {
        query.orderBy(sortBy, sortOrder || 'ASC');
      } else {
        query.orderBy(`portfolio.${sortBy}`, sortOrder || 'ASC');
      }
    } else {
      query.orderBy('portfolio.name', 'ASC');
    }

    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [items, total] = await query.getManyAndCount();
    return { items, total };
  }

  async create(portfolio: Partial<Portfolio>): Promise<Portfolio> {
    const newPortfolio = this.repository.create(portfolio);
    return this.repository.save(newPortfolio);
  }

  async update(portfolioId: string, portfolio: Partial<Portfolio>): Promise<Portfolio> {
    await this.repository.update(portfolioId, portfolio);
    const updatedPortfolio = await this.findById(portfolioId);
    if (!updatedPortfolio) {
      throw new Error('Portfolio not found after update');
    }
    return updatedPortfolio;
  }

  async delete(portfolioId: string): Promise<void> {
    await this.repository.delete(portfolioId);
  }
}
