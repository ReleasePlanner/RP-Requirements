export enum WidgetType {
    STATS_OVERVIEW = 'STATS_OVERVIEW',
    REQUIREMENTS_CHART = 'REQUIREMENTS_CHART',
    RECENT_ACTIVITY = 'RECENT_ACTIVITY',
    PRIORITY_CHART = 'PRIORITY_CHART',
    VALUE_EFFORT_MATRIX = 'VALUE_EFFORT_MATRIX',
    PORTFOLIO_HEALTH = 'PORTFOLIO_HEALTH'
}

export interface Widget {
    widgetId: string;
    title: string;
    type: WidgetType;
    config?: any;
    isVisible: boolean;
    defaultOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}
