import { Requirement, RequirementReference } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const RequirementsService = {
    getAll: async (params: any): Promise<{ items: Requirement[]; total: number }> => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params.epicIds && params.epicIds.length > 0) {
            params.epicIds.forEach((id: string) => searchParams.append('epicIds', id));
        }

        const response = await fetch(`${API_URL}/requirements?${searchParams.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch requirements');
        const json = await response.json();
        return json.data || json;
    },

    create: async (data: any): Promise<Requirement> => {
        const response = await fetch(`${API_URL}/requirements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create requirement');
        const json = await response.json();
        return json.data || json;
    },

    update: async (id: string, data: any): Promise<Requirement> => {
        const response = await fetch(`${API_URL}/requirements/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update requirement');
        const json = await response.json();
        return json.data || json;
    },

    getReferences: async (requirementId: string): Promise<RequirementReference[]> => {
        const response = await fetch(`${API_URL}/requirements/${requirementId}/references`, { cache: 'no-store' });
        if (!response.ok) return [];
        const json = await response.json();
        return json.data || json;
    },

    createReference: async (requirementId: string, data: Partial<RequirementReference>): Promise<RequirementReference> => {
        const response = await fetch(`${API_URL}/requirements/${requirementId}/references`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create reference');
        const json = await response.json();
        return json.data || json;
    },

    updateReference: async (requirementId: string, referenceId: string, data: Partial<RequirementReference>): Promise<RequirementReference> => {
        const response = await fetch(`${API_URL}/requirements/${requirementId}/references/${referenceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update reference');
        const json = await response.json();
        return json.data || json;
    },

    deleteReference: async (requirementId: string, referenceId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/requirements/${requirementId}/references/${referenceId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete reference');
    }
};
