import { Initiative, CreateInitiativeDto, UpdateInitiativeDto } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const InitiativesService = {
    getAll: async (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC', portfolioId?: string }): Promise<{ items: Initiative[]; total: number }> => {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
        if (params?.portfolioId) query.append('portfolioId', params.portfolioId);

        const response = await fetch(`${API_URL}/initiatives?${query.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch initiatives');
        const json = await response.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
            return { items: data, total: data.length };
        }
        return data;
    },

    create: async (data: CreateInitiativeDto): Promise<Initiative> => {
        const response = await fetch(`${API_URL}/initiatives`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to create initiative');
        }
        const json = await response.json();
        return json.data || json;
    },

    update: async (id: string, data: UpdateInitiativeDto): Promise<Initiative> => {
        const response = await fetch(`${API_URL}/initiatives/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to update initiative');
        }
        const json = await response.json();
        return json.data || json;
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/initiatives/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to delete initiative');
        }
    }
};
