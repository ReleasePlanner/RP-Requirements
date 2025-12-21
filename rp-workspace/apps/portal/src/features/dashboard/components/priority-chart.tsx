import React, { useEffect, useState } from 'react';
import { Widget } from '../types';
import { DashboardWidget } from './dashboard-widget';
import { RequirementsService } from '@/features/requirements/service';

export function PriorityChart({ widget, className, dragHandleProps }: { widget: Widget, className?: string, dragHandleProps?: any }) {
    const [data, setData] = useState<{ priority: string; count: number; color: string }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await RequirementsService.getAll({ limit: 1000 });
                const reqs = response.items;

                const priorityCounts: Record<string, number> = {};
                reqs.forEach(r => {
                    const priority = r.priority?.name || 'Unassigned';
                    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
                });

                const colorMap: Record<string, string> = {
                    'Critical': 'bg-red-600',
                    'High': 'bg-orange-500',
                    'Medium': 'bg-yellow-500',
                    'Low': 'bg-green-500',
                    'Unassigned': 'bg-gray-400'
                };

                const chartData = Object.entries(priorityCounts).map(([priority, count]) => ({
                    priority,
                    count,
                    color: colorMap[priority] || 'bg-blue-500'
                }));

                // Sort by predefined order ideally, but simple sort here
                setData(chartData.sort((a, b) => b.count - a.count));
            } catch (error) {
                console.error('Failed to load priority chart data', error);
            }
        };
        loadData();
    }, []);

    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <DashboardWidget widget={widget} className={className || "col-span-1"} dragHandleProps={dragHandleProps}>
            <div className="space-y-3 pt-2">
                {data.map((item) => (
                    <div key={item.priority} className="space-y-1.5 group">
                        <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-foreground/80 group-hover:text-foreground transition-colors truncate pr-2" title={item.priority}>{item.priority}</span>
                            <span className="text-muted-foreground shrink-0">{item.count}</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${item.color} transition-all duration-500`}
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center text-muted-foreground py-8 text-sm">No data available</div>
                )}
            </div>
        </DashboardWidget>
    );
}
