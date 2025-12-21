import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsor } from '@domain/entities/sponsor.entity';
import { SponsorsController } from './sponsors.controller';
import { SponsorsService } from '@application/sponsors/services/sponsors.service';
import { SponsorRepository } from '@infrastructure/repositories/sponsor.repository';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Sponsor])],
  controllers: [SponsorsController],
  providers: [
    SponsorsService,
    {
      provide: 'ISponsorRepository',
      useClass: SponsorRepository,
    },
  ],
  exports: [SponsorsService],
})
export class SponsorsModule { }
