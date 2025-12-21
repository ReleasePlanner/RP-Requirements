import React, { useEffect, useState } from 'react';
import { Widget } from '../types';
import { DashboardWidget } from './dashboard-widget';
import { Progress } from '@/components/ui/progress';

export function PortfolioHealthWidget({ widget, className, dragHandleProps }: { widget: Widget, className?: string, dragHandleProps?: any }) {
    // Mocking Portfolio Data for now as PortfolioService might not be fully exposed or populated
    // Ideally this comes from PortfoliosService.getAllWithStats()
    const [portfolios, setPortfolios] = useState([
        { id: '1', name: 'Digital Transformation', progress: 75, status: 'On Track', color: 'bg-green-500' },
        { id: '2', name: 'Legacy Modernization', progress: 30, status: 'At Risk', color: 'bg-red-500' },
        { id: '3', name: 'Cloud Native', progress: 50, status: 'Delayed', color: 'bg-yellow-500' }
    ]);

    return (
        <DashboardWidget widget={widget} className={className || "col-span-1 md:col-span-2"} dragHandleProps={dragHandleProps}>
            <div className="space-y-5 pt-2 px-2">
                {portfolios.map(p => (
                    <div key={p.id} className="space-y-2 group">
                        <div className="flex justify-between items-end gap-4">
                            <div className="space-y-0.5 min-w-0 flex-1">
                                <span className="text-sm font-semibold tracking-tight block truncate" title={p.name}>{p.name}</span>
                                <span className={`text-[10px] uppercase tracking-wider font-bold ${p.status === 'On Track' ? 'text-green-600 dark:text-green-400' :
                                    p.status === 'At Risk' ? 'text-red-600 dark:text-red-400' :
                                        'text-yellow-600 dark:text-yellow-400'
                                    }`}>{p.status}</span>
                            </div>
                            <span className="text-sm font-bold text-muted-foreground shrink-0">{p.progress}%</span>
                        </div>
                        <Progress
                            value={p.progress}
                            className="h-1.5 bg-secondary/50 rounded-full"
                            indicatorColor={p.color}
                        />
                    </div>
                ))}
            </div>
        </DashboardWidget>
    );
}
