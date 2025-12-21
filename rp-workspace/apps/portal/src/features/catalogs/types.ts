export interface VerificationMethod {
    verificationMethodId: number;
    name: string;
    description?: string;
    status?: string;
}

export interface Priority {
    priorityId: number;
    name: string;
    status?: string;
}

export interface LifecycleStatus {
    statusId: number;
    name: string;
    status?: string;
}

export interface RiskLevel {
    riskLevelId: number;
    name: string;
    status?: string;
}

export interface Complexity {
    complexityId: number;
    name: string;
    status?: string;
}

export interface Metric {
    metricId: number;
    name: string;
    baselineValue?: string;
    targetGoal?: string;
    status?: string;
}

export interface RequirementType {
    typeId: number;
    name: string;
    status?: string;
}

export interface ProductOwner {
    productOwnerId: string;
    firstName: string;
    lastName: string;
    role: string;
    status?: string;
}

export interface Approver {
    approverId: string;
    firstName: string;
    lastName: string;
    role: string;
    status?: string;
}
