export type UniqueId = string | number;

export interface KanbanItem {
    id: UniqueId;
    content: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface KanbanColumn {
    id: UniqueId;
    title: string;
    items: KanbanItem[];
}
