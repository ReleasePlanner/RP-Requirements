import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from '@domain/entities/portfolio.entity';
import { PortfoliosController } from './portfolios.controller';
import { PortfoliosService } from '@application/portfolios/services/portfolios.service';
import { PortfolioRepository } from '@infrastructure/repositories/portfolio.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio])],
  controllers: [PortfoliosController],
  providers: [
    PortfoliosService,
    {
      provide: 'IPortfolioRepository',
      useClass: PortfolioRepository,
    },
  ],
  exports: [PortfoliosService],
})
export class PortfoliosModule {}
