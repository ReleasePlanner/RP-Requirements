import { RequirementReference } from '@domain/entities/requirement-reference.entity';

export interface IRequirementReferenceRepository {
    create(data: Partial<RequirementReference>): Promise<RequirementReference>;
    update(id: string, data: Partial<RequirementReference>): Promise<RequirementReference>;
    delete(id: string): Promise<void>;
    findByRequirementId(requirementId: string): Promise<RequirementReference[]>;
}
