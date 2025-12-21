import { Initiative } from "../initiatives/types";

export interface Portfolio {
    portfolioId: string;
    name: string;
    status?: string;
    sponsorId?: string;
    sponsor?: {
        sponsorId: string;
        name: string;
    };
    initiatives?: Initiative[];
    creationDate?: string;
    initiativeCount?: number;
}

export interface CreatePortfolioDto {
    name: string;
    sponsorId?: string;
    status?: string;
}

export interface UpdatePortfolioDto extends Partial<CreatePortfolioDto> { }
