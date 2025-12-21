import { ProductOwner, Approver } from '../catalogs/types';

export interface RequirementReference {
    referenceId: string;
    type: string;
    path: string;
    referenceName: string;
    description?: string;
    status: string;
    requirementId: string;
}

export interface Requirement {
    requirementId: string;
    code: string;
    title: string;
    storyStatement: string; // description
    acceptanceCriteria?: string;

    // Core Attributes
    priorityId?: number;
    priority?: { name: string };
    complexityId?: number;
    complexity?: { name: string };
    riskLevelId?: number;
    riskLevel?: { name: string };
    sourceId?: number;
    source?: { name: string };
    effortTypeId?: number;
    effortType?: { name: string };
    metricId?: number;
    metric?: { name: string };

    // Governance
    // Governance
    verificationMethodId?: number;
    verificationMethod?: { name: string };

    // Financials & Dates
    effortEstimate?: number;
    actualEffort?: number;
    creationDate: string;
    goLiveDate?: string;
    requirementStatusDate?: string;
    requirementVersion?: string;

    // Links & Roles
    isMandatory: boolean;
    changeHistoryLink?: string;
    ownerRole?: string;
    applicablePhase?: string;

    // Relations
    epicId?: string;
    epic?: { name: string };
    productOwnerId?: string;
    productOwner?: ProductOwner;
    approverId?: string;
    approver?: Approver;
    status?: { name: string };
    updatedAt?: string; // Optional if backend adds it later, but using creationDate for now
}

export interface CreateRequirementDto {
    title: string;
    storyStatement?: string;
    acceptanceCriteria?: string;

    priorityId?: number;
    complexityId?: number;
    riskLevelId?: number;
    sourceId?: number;
    effortTypeId?: number;
    metricId?: number;

    verificationMethodId?: number;

    effortEstimate?: number;
    actualEffort?: number;
    goLiveDate?: string;
    requirementVersion?: string;
    requirementStatusDate?: string;

    isMandatory?: boolean;
    changeHistoryLink?: string;
    ownerRole?: string;
    applicablePhase?: string;

    epicId?: string;
    productOwnerId?: string;
    approverId?: string;
}

export interface UpdateRequirementDto extends Partial<CreateRequirementDto> { }
