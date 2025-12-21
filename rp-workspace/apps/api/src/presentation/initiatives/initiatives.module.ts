import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiativesService } from '@application/initiatives/services/initiatives.service';
import { InitiativesController } from './initiatives.controller';
import { InitiativesRepository } from '@infrastructure/database/repositories/initiatives.repository';
import { Initiative } from '@domain/entities/initiative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Initiative])],
  controllers: [InitiativesController],
  providers: [
    InitiativesService,
    {
      provide: 'IInitiativesRepository',
      useClass: InitiativesRepository,
    },
  ],
  exports: [InitiativesService],
})
export class InitiativesModule {}
