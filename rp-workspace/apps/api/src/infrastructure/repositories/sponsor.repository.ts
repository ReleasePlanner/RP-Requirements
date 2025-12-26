import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsor } from '@domain/entities/sponsor.entity';
import { ISponsorRepository } from '@application/interfaces/repositories/sponsor.repository.interface';

@Injectable()
export class SponsorRepository implements ISponsorRepository {
  constructor(
    @InjectRepository(Sponsor)
    private readonly repository: Repository<Sponsor>,
  ) {}

  async findById(sponsorId: string): Promise<Sponsor | null> {
    return this.repository.findOne({ where: { sponsorId } });
  }

  async findByEmail(email: string): Promise<Sponsor | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findAll(): Promise<Sponsor[]> {
    return this.repository.find();
  }

  async create(sponsor: Partial<Sponsor>): Promise<Sponsor> {
    const newSponsor = this.repository.create(sponsor);
    return this.repository.save(newSponsor);
  }

  async update(sponsorId: string, sponsor: Partial<Sponsor>): Promise<Sponsor> {
    await this.repository.update(sponsorId, sponsor);
    const updatedSponsor = await this.findById(sponsorId);
    if (!updatedSponsor) {
      throw new Error('Sponsor not found after update');
    }
    return updatedSponsor;
  }

  async delete(sponsorId: string): Promise<void> {
    await this.repository.delete(sponsorId);
  }
}
