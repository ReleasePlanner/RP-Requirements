import React, { useEffect, useState } from 'react';
import { Widget } from '../types';
import { DashboardWidget } from './dashboard-widget';
import { RequirementsService } from '@/features/requirements/service';
import { Requirement } from '@/features/requirements/types';

export function RequirementsChart({ widget, className, dragHandleProps }: { widget: Widget, className?: string, dragHandleProps?: any }) {
    const [data, setData] = useState<{ status: string; count: number; color: string }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch all requirements to aggregate by status
                // Optimized approach would be an aggregation API, but for now we fetch all (limit 1000)
                const response = await RequirementsService.getAll({ limit: 1000 });
                const reqs = response.items;

                const statusCounts: Record<string, number> = {};
                reqs.forEach(r => {
                    const status = r.status?.name || 'Unknown';
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                });

                // Convert to array and assign arbitrary colors
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                const chartData = Object.entries(statusCounts).map(([status, count], index) => ({
                    status,
                    count,
                    color: colors[index % colors.length]
                }));

                setData(chartData);
            } catch (error) {
                console.error('Failed to load requirements chart data', error);
            }
        };
        loadData();
    }, []);

    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <DashboardWidget widget={widget} className={className || "col-span-1 md:col-span-2"} dragHandleProps={dragHandleProps}>
            <div className="space-y-3 pt-2">
                {data.map((item) => (
                    <div key={item.status} className="space-y-1.5 group">
                        <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-foreground/80 group-hover:text-foreground transition-colors truncate pr-2" title={item.status}>{item.status}</span>
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
