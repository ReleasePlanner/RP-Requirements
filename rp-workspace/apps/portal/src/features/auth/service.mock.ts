import { User } from '@/types/user';

export interface AuthService {
    login(username: string): Promise<{ user: User; accessToken: string }>;
    logout(): Promise<void>;
    getSession(): Promise<User | null>;
}

export const MockAuthService: AuthService = {
    login: async (username: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock User based on Primavera roles
        const mockUser: User = {
            id: '1',
            name: 'Admin User',
            email: `${username}@example.com`,
            role: 'ADMIN', // Simple RBAC
            avatarUrl: 'https://github.com/shadcn.png',
        };

        return {
            user: mockUser,
            accessToken: 'mock_jwt_token_' + Date.now(),
        };
    },

    logout: async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
    },

    getSession: async () => {
        return null; // Implemented via Server Actions / Cookie check normally
    },
};
