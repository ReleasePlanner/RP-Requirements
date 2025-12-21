import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpicsService } from '@application/epics/services/epics.service';
import { EpicsController } from './epics.controller';
import { EpicsRepository } from '@infrastructure/database/repositories/epics.repository';
import { Epic } from '@domain/entities/epic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Epic])],
  controllers: [EpicsController],
  providers: [
    EpicsService,
    {
      provide: 'IEpicsRepository',
      useClass: EpicsRepository,
    },
  ],
  exports: [EpicsService],
})
export class EpicsModule {}
