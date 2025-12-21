import { Injectable, Inject } from '@nestjs/common';
import { ISponsorRepository } from '../interfaces/repositories/sponsor.repository.interface';
import { Sponsor } from '@domain/entities/sponsor.entity';
import { EntityNotFoundException } from '@shared/exceptions/entity-not-found.exception'; // Usage generic or rename specific

@Injectable()
export class SponsorsService {
  constructor(
    @Inject('ISponsorRepository')
    private readonly sponsorRepository: ISponsorRepository,
  ) { }

  async findAll(): Promise<Sponsor[]> {
    return this.sponsorRepository.findAll();
  }

  async findOne(sponsorId: string): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findById(sponsorId);
    if (!sponsor) {
      throw new EntityNotFoundException('Sponsor', sponsorId);
    }
    return sponsor;
  }

  async create(createSponsorDto: any): Promise<Sponsor> {
    return this.sponsorRepository.create(createSponsorDto);
  }

  async update(sponsorId: string, updateSponsorDto: any): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findById(sponsorId);
    if (!sponsor) {
      throw new EntityNotFoundException('Sponsor', sponsorId);
    }
    return this.sponsorRepository.update(sponsorId, updateSponsorDto);
  }

  async delete(sponsorId: string): Promise<void> {
    const sponsor = await this.sponsorRepository.findById(sponsorId);
    if (!sponsor) {
      throw new EntityNotFoundException('Sponsor', sponsorId);
    }
    return this.sponsorRepository.delete(sponsorId);
  }
}
