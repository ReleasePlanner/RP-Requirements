import { Portfolio } from '@domain/entities/portfolio.entity';

export interface IPortfolioRepository {
  findById(portfolioId: string): Promise<Portfolio | null>;
  findAll(options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ items: Portfolio[]; total: number }>;
  create(portfolio: Partial<Portfolio>): Promise<Portfolio>;
  update(portfolioId: string, portfolio: Partial<Portfolio>): Promise<Portfolio>;
  delete(portfolioId: string): Promise<void>;
}
