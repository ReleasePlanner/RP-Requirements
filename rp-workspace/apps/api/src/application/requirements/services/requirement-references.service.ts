import { Injectable, Inject } from '@nestjs/common';
import { IRequirementReferenceRepository } from '../interfaces/repositories/requirement-reference.repository.interface';
import { CreateRequirementReferenceDto } from '../dto/create-requirement-reference.dto';
import { UpdateRequirementReferenceDto } from '../dto/update-requirement-reference.dto';

@Injectable()
export class RequirementReferencesService {
  constructor(
    @Inject('IRequirementReferenceRepository')
    private readonly referenceRepository: IRequirementReferenceRepository,
  ) {}

  async create(createDto: CreateRequirementReferenceDto) {
    return this.referenceRepository.create(createDto);
  }

  async update(id: string, updateDto: UpdateRequirementReferenceDto) {
    return this.referenceRepository.update(id, updateDto);
  }

  async delete(id: string) {
    return this.referenceRepository.delete(id);
  }

  async findByRequirementId(requirementId: string) {
    return this.referenceRepository.findByRequirementId(requirementId);
  }
}
