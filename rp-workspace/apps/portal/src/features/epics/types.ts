export interface Epic {
    epicId: string;
    name: string;
    goal?: string;
    businessCaseLink?: string; // New
    actualCost?: number; // New
    startDate?: string;
    endDate?: string;
    status_text?: string;
    initiativeId?: string;
    initiative?: { title: string };
    statusId?: number; // New
    status?: { name: string };
}

export interface CreateEpicDto {
    name: string;
    goal?: string;
    businessCaseLink?: string;
    actualCost?: number;
    initiativeId?: string;
    statusId?: number;
    status_text?: string;
    startDate?: string;
    endDate?: string;
}

export interface UpdateEpicDto extends Partial<CreateEpicDto> { }
