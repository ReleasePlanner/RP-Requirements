import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRequirementReferenceRepository } from '@application/requirements/interfaces/repositories/requirement-reference.repository.interface';
import { RequirementReference } from '@domain/entities/requirement-reference.entity';

@Injectable()
export class RequirementReferenceRepository implements IRequirementReferenceRepository {
    constructor(
        @InjectRepository(RequirementReference)
        private readonly repository: Repository<RequirementReference>
    ) { }

    async create(data: Partial<RequirementReference>): Promise<RequirementReference> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(id: string, data: Partial<RequirementReference>): Promise<RequirementReference> {
        await this.repository.update(id, data);
        const updated = await this.repository.findOne({ where: { referenceId: id } });
        if (!updated) throw new Error('Reference not found');
        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    async findByRequirementId(requirementId: string): Promise<RequirementReference[]> {
        return this.repository.find({
            where: { requirementId }
        });
    }
}
