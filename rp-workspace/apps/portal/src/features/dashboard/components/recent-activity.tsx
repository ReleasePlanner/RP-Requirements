import React, { useEffect, useState } from 'react';
import { Widget } from '../types';
import { DashboardWidget } from './dashboard-widget';
import { RequirementsService } from '@/features/requirements/service';
import { Requirement } from '@/features/requirements/types';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity({ widget, className, dragHandleProps }: { widget: Widget, className?: string, dragHandleProps?: any }) {
    const [activities, setActivities] = useState<Requirement[]>([]);

    useEffect(() => {
        const loadActivities = async () => {
            try {
                // Fetch latest updated requirements
                const response = await RequirementsService.getAll({
                    limit: 5,
                    sortBy: 'updatedAt',
                    sortOrder: 'DESC'
                });
                setActivities(response.items);
            } catch (error) {
                console.error('Failed to load recent activity', error);
            }
        };
        loadActivities();
    }, []);

    return (
        <DashboardWidget widget={widget} className={className || "col-span-1 md:col-span-2"} dragHandleProps={dragHandleProps}>
            <div className="space-y-3 pt-2">
                {activities.map((req) => (
                    <div key={req.requirementId} className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border-b last:border-0 border-border/50">
                        <div className="mt-1.5 shrink-0">
                            <div className="h-2 w-2 rounded-full bg-primary/20 ring-4 ring-primary/5" />
                        </div>
                        <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <p className="text-sm font-semibold text-foreground leading-none tracking-tight truncate pr-2">{req.title}</p>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium shrink-0 whitespace-nowrap">
                                    {req.creationDate ? formatDistanceToNow(new Date(req.creationDate), { addSuffix: true }) : 'Recently'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium text-muted-foreground bg-secondary/50 hover:bg-secondary/70 border-0 shrink-0">
                                    {req.code}
                                </Badge>
                                {req.status && (
                                    <Badge className="text-[10px] px-2 py-0 font-medium h-5 bg-primary/10 text-primary hover:bg-primary/20 border-0 shadow-none truncate max-w-[100px]">
                                        {req.status.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {activities.length === 0 && (
                    <div className="text-center text-muted-foreground py-8 text-sm">No recent activity</div>
                )}
            </div>
        </DashboardWidget>
    );
}
