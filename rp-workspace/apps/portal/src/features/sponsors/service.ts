export interface Sponsor {
    sponsorId: string;
    name: string;
    email: string;
    role?: string;
    isActive?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const SponsorsService = {
    getAll: async (): Promise<Sponsor[]> => {
        try {
            const response = await fetch(`${API_URL}/sponsors`, { cache: 'no-store' });
            if (!response.ok) return [];
            const json = await response.json();
            return json.data || json;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    create: async (data: Partial<Sponsor> & { password?: string }): Promise<Sponsor> => {
        const response = await fetch(`${API_URL}/auth/register`, { // Using register for creation to handle password
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create sponsor');
        return response.json();
    },

    update: async (id: string, data: Partial<Sponsor>): Promise<Sponsor> => {
        const response = await fetch(`${API_URL}/sponsors/${id}`, { // Assuming /sponsors/:id PATCH/PUT endpoint exists (generic CRUD usually)
            // Wait, SponsorsController only had findAll and findOne. I need to add CRUD to Controller? 
            // Implementation Plan said "Creating a new SponsorsPage... for CRUD".
            // If Controller lacks CREATE/UPDATE/DELETE, I must add them to API!
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update sponsor');
        return response.json();
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/sponsors/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete sponsor');
    }
};
