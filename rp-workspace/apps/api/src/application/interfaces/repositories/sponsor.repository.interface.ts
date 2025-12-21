import { Sponsor } from '@domain/entities/sponsor.entity';

export interface ISponsorRepository {
  findById(sponsorId: string): Promise<Sponsor | null>;
  findByEmail(email: string): Promise<Sponsor | null>;
  findAll(): Promise<Sponsor[]>;
  create(sponsor: Partial<Sponsor>): Promise<Sponsor>;
  update(sponsorId: string, sponsor: Partial<Sponsor>): Promise<Sponsor>;
  delete(sponsorId: string): Promise<void>;
}
