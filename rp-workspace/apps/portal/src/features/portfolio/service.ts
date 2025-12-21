import { Portfolio, CreatePortfolioDto, UpdatePortfolioDto } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export type GetPortfoliosParams = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
};

export type PaginatedResult<T> = {
    items: T[];
    total: number;
};

export const PortfolioService = {
    getAll: async (params?: GetPortfoliosParams): Promise<PaginatedResult<Portfolio>> => {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

        const response = await fetch(`${API_URL}/portfolios?${query.toString()}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('PortfolioService Error Response:', await response.text());
            throw new Error(`Failed to fetch portfolios: ${response.statusText} (${response.status})`);
        }

        const json = await response.json();
        console.log('PortfolioService Raw JSON:', json);

        // Handle wrapped responses if API changes, but current impl returns { items, total } directly or via data
        const data = json.data || json;
        console.log('PortfolioService Extracted Data:', data);

        // Map if necessary
        const items = (data.items || []).map((p: any) => ({
            ...p
        }));

        return { items, total: data.total || 0 };
    },

    create: async (data: CreatePortfolioDto): Promise<Portfolio> => {
        const response = await fetch(`${API_URL}/portfolios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to create portfolio');
        }
        const json = await response.json();
        return json.data || json;
    },

    update: async (id: string, data: UpdatePortfolioDto): Promise<Portfolio> => {
        const response = await fetch(`${API_URL}/portfolios/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to update portfolio');
        }
        const json = await response.json();
        return json.data || json;
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/portfolios/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to delete portfolio');
        }
    }
};
