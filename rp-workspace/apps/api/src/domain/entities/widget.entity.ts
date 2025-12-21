import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum WidgetType {
    STATS_OVERVIEW = 'STATS_OVERVIEW',
    REQUIREMENTS_CHART = 'REQUIREMENTS_CHART',
    RECENT_ACTIVITY = 'RECENT_ACTIVITY',
    PRIORITY_CHART = 'PRIORITY_CHART',
    VALUE_EFFORT_MATRIX = 'VALUE_EFFORT_MATRIX',
    PORTFOLIO_HEALTH = 'PORTFOLIO_HEALTH'
}

@Entity('widgets')
export class Widget {
    @PrimaryGeneratedColumn('uuid')
    widgetId: string;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: WidgetType,
        default: WidgetType.STATS_OVERVIEW
    })
    type: WidgetType;

    @Column({ type: 'jsonb', nullable: true })
    config: any;

    @Column({ default: true })
    isVisible: boolean;

    @Column({ type: 'int', default: 0 })
    defaultOrder: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
