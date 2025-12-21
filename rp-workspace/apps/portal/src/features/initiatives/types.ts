import { Epic } from "../epics/types";

export interface Initiative {
    initiativeId: string;
    title: string;
    strategicGoal?: string;
    estimatedBusinessBenefit?: number;
    estimatedCost?: number; // New
    estimatedROI?: number; // New
    dateProposed?: string;
    status_text?: string;
    portfolioId?: string;
    portfolio?: { name: string };
    statusId?: number; // New
    status?: { name: string };
    epics?: Epic[];
}

export interface CreateInitiativeDto {
    title: string;
    strategicGoal?: string;
    estimatedBusinessBenefit?: number;
    estimatedCost?: number;
    estimatedROI?: number;
    portfolioId?: string;
    statusId?: number;
    status_text?: string;
    dateProposed?: string;
}

export interface UpdateInitiativeDto extends Partial<CreateInitiativeDto> { }
