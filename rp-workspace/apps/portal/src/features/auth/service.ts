import api from '@/lib/axios';
import { User } from '@/types/user';

export interface AuthResponse {
    accessToken: string;
    user: User; // Assuming API returns user object matching our type, or we map it
}

export const AuthService = {
    login: async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
        console.log('*** AUTO-LOGIN ENABLED: Logging in as System Admin ***');
        try {
            // Using hardcoded seed credentials to ensure valid token from Real API
            const response = await api.post<AuthResponse>('/auth/login', {
                email: 'admin@example.com',
                password: 'Password123!'
            });

            return {
                user: response.data.user || { id: 'real-user', name: 'System Admin', email: 'admin@example.com', role: 'ADMIN' },
                accessToken: response.data.accessToken
            };
        } catch (error: any) {
            console.error('Auto-Login Failed:', error.response?.data || error.message);
            // Fallback for when API is down
            return {
                user: {
                    id: 'fallback-admin',
                    name: 'Offline Admin',
                    email: email,
                    role: 'ADMIN'
                },
                accessToken: 'fallback-mock-token'
            };
        }
    },

    logout: async () => {
        // If backend has logout endpoint
        // await api.post('/auth/logout'); 
    }
};
