import { KanbanColumn } from './types';

export const MockBoardService = {
    getBoard: async (): Promise<KanbanColumn[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        return [
            {
                id: 'todo',
                title: 'To Do',
                items: [
                    { id: '1', content: 'Design System Audit', priority: 'MEDIUM' },
                    { id: '2', content: 'Setup CI/CD Pipeline', priority: 'HIGH' },
                ],
            },
            {
                id: 'doing',
                title: 'In Progress',
                items: [
                    { id: '3', content: 'Gantt Chart Implementation', priority: 'HIGH' },
                ],
            },
            {
                id: 'done',
                title: 'Done',
                items: [
                    { id: '4', content: 'Project Setup', priority: 'LOW' },
                    { id: '5', content: 'Authentication Flow', priority: 'HIGH' },
                ],
            },
        ];
    }
};
