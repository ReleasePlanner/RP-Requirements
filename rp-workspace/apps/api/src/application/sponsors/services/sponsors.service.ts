import { Injectable, Inject } from '@nestjs/common';
import { ISponsorRepository } from '../interfaces/repositories/sponsor.repository.interface';
import { Sponsor } from '@domain/entities/sponsor.entity';
import { EntityNotFoundException } from '@shared/exceptions/entity-not-found.exception';
import { CreateSponsorDto } from '../dto/create-sponsor.dto';
import { UpdateSponsorDto } from '../dto/update-sponsor.dto';

/**
 * Sponsors Service
 *
 * Handles business logic for sponsor management including CRUD operations
 */
@Injectable()
export class SponsorsService {
  constructor(
    @Inject('ISponsorRepository')
    private readonly sponsorRepository: ISponsorRepository,
  ) {}

  /**
   * Retrieves all sponsors
   *
   * @returns List of all sponsors
   */
  async findAll(): Promise<Sponsor[]> {
    return this.sponsorRepository.findAll();
  }

  /**
   * Retrieves a sponsor by ID
   *
   * @param sponsorId - Unique identifier of the sponsor
   * @returns Sponsor entity
   * @throws EntityNotFoundException if sponsor not found
   */
  async findOne(sponsorId: string): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findById(sponsorId);
    if (!sponsor) {
      throw new EntityNotFoundException('Sponsor', sponsorId);
    }
    return sponsor;
  }

  /**
   * Creates a new sponsor
   *
   * @param createSponsorDto - Data for creating the sponsor
   * @returns Created sponsor entity
   */
  async create(createSponsorDto: CreateSponsorDto): Promise<Sponsor> {
    return this.sponsorRepository.create(createSponsorDto);
  }

  /**
   * Updates an existing sponsor
   *
   * @param sponsorId - Unique identifier of the sponsor to update
   * @param updateSponsorDto - Data for updating the sponsor
   * @returns Updated sponsor entity
   * @throws EntityNotFoundException if sponsor not found
   */
  async update(sponsorId: string, updateSponsorDto: UpdateSponsorDto): Promise<Sponsor> {
    const sponsor = await this.sponsorRepository.findById(sponsorId);
    if (!sponsor) {
      throw new EntityNotFoundException('Sponsor', sponsorId);
    }
    return this.sponsorRepository.update(sponsorId, updateSponsorDto);
  }

  /**
   * Deletes a sponsor by ID
   *
   * @param sponsorId - Unique identifier of the sponsor to delete
   * @throws EntityNotFoundException if sponsor not found
   */
  async delete(sponsorId: string): Promise<void> {
    const sponsor = await this.sponsorRepository.findById(sponsorId);
    if (!sponsor) {
      throw new EntityNotFoundException('Sponsor', sponsorId);
    }
    return this.sponsorRepository.delete(sponsorId);
  }
}
