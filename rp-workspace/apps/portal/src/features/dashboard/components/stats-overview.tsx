import React, { useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Activity, Briefcase, CheckSquare, Users } from 'lucide-react';
import { Widget } from '../types';
import { DashboardWidget } from './dashboard-widget';
import { RequirementsService } from '@/features/requirements/service';
// Assuming other services exist, otherwise mock or omit
// import { PortfoliosService } from '@/features/portfolios/service'; 

export function StatsOverview({ widget, className, dragHandleProps }: { widget: Widget, className?: string, dragHandleProps?: any }) {
    const [stats, setStats] = useState({
        totalRequirements: 0,
        activePortfolios: 0,
        strategicInitiatives: 0,
        activeUsers: 8 // Mocked for now
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Parallel fetch for real data
                const reqs = await RequirementsService.getAll({ limit: 1 }); // Just to get total
                // const portfolios = await PortfoliosService.getAll();
                // const initiatives = await InitiativesService.getAll();

                setStats({
                    totalRequirements: reqs.total,
                    activePortfolios: 1, // Mock
                    strategicInitiatives: 3, // Mock
                    activeUsers: 8 // Mock
                });
            } catch (error) {
                console.error('Failed to load stats', error);
            }
        };
        loadStats();
    }, []);

    return (
        <DashboardWidget widget={widget} className={className || "col-span-1 md:col-span-2 lg:col-span-4"} dragHandleProps={dragHandleProps}>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-2">
                <div className="flex flex-col space-y-3 p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">Active Portfolios</span>
                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0 ml-2">
                            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{stats.activePortfolios}</div>
                </div>
                <div className="flex flex-col space-y-3 p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">Strategic Initiatives</span>
                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0 ml-2">
                            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{stats.strategicInitiatives}</div>
                </div>
                <div className="flex flex-col space-y-3 p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">Total Requirements</span>
                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0 ml-2">
                            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{stats.totalRequirements}</div>
                </div>
                <div className="flex flex-col space-y-3 p-5 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">Active Users</span>
                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0 ml-2">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{stats.activeUsers}</div>
                </div>
            </div>
        </DashboardWidget>
    );
}
