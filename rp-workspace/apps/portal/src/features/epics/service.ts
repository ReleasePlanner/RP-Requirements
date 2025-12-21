import { Epic, CreateEpicDto, UpdateEpicDto } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const EpicsService = {
    getAll: async (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC', initiativeId?: string }): Promise<{ items: Epic[]; total: number }> => {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
        if (params?.initiativeId) query.append('initiativeId', params.initiativeId);

        const response = await fetch(`${API_URL}/epics?${query.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch epics');
        const json = await response.json();
        const data = json.data || json;
        if (Array.isArray(data)) {
            return { items: data, total: data.length };
        }
        return data;
    },

    create: async (data: CreateEpicDto): Promise<Epic> => {
        const response = await fetch(`${API_URL}/epics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to create epic');
        }
        const json = await response.json();
        return json.data || json;
    },

    update: async (id: string, data: UpdateEpicDto): Promise<Epic> => {
        const response = await fetch(`${API_URL}/epics/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to update epic');
        }
        const json = await response.json();
        return json.data || json;
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/epics/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.message || 'Failed to delete epic');
        }
    }
};
