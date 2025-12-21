import { Widget } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const WidgetsService = {
    getAll: async (): Promise<Widget[]> => {
        const response = await fetch(`${API_URL}/widgets`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch widgets');
        const json = await response.json();
        return Array.isArray(json) ? json : (json.data || []);
    },

    create: async (data: Partial<Widget>): Promise<Widget> => {
        const response = await fetch(`${API_URL}/widgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create widget');
        return await response.json();
    },

    update: async (id: string, data: Partial<Widget>): Promise<Widget> => {
        const response = await fetch(`${API_URL}/widgets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update widget');
        return await response.json();
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/widgets/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete widget');
    }
};
