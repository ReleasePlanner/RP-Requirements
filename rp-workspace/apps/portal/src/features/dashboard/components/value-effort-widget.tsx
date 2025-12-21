import React, { useEffect, useState } from 'react';
import { Widget } from '../types';
import { DashboardWidget } from './dashboard-widget';
import { RequirementsService } from '@/features/requirements/service';

export function ValueEffortWidget({ widget, className, dragHandleProps }: { widget: Widget, className?: string, dragHandleProps?: any }) {
    const [stats, setStats] = useState<{
        quickWins: number;
        strategicBets: number;
        fillers: number;
        timeSinks: number;
    }>({ quickWins: 0, strategicBets: 0, fillers: 0, timeSinks: 0 });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch requirements with value and effort
                const response = await RequirementsService.getAll({ limit: 1000 });
                const reqs = response.items;

                let qw = 0, sb = 0, f = 0, ts = 0;

                // Thresholds (could be dynamic or average based)
                const VALUE_THRESHOLD = 50;
                const EFFORT_THRESHOLD = 8; // e.g., points

                reqs.forEach(r => {
                    // Adapt field names as per actual API return (assuming businessValue and effortEstimate exist)
                    // If not returning in list, might need detailed fetch or specific projection
                    // For now, assume partial data or map standard fields

                    // Note: Types say 'effortEstimate' and 'businessValue' (need to verify if API returns businessValue)
                    // Checking Requirement entity: yes, businessValue exists.

                    const val = (r as any).businessValue || 0;
                    const eff = r.effortEstimate || 0;

                    if (val >= VALUE_THRESHOLD && eff < EFFORT_THRESHOLD) qw++;      // High Value, Low Effort
                    else if (val >= VALUE_THRESHOLD && eff >= EFFORT_THRESHOLD) sb++; // High Value, High Effort
                    else if (val < VALUE_THRESHOLD && eff < EFFORT_THRESHOLD) f++;    // Low Value, Low Effort
                    else ts++;                                                       // Low Value, High Effort
                });

                setStats({ quickWins: qw, strategicBets: sb, fillers: f, timeSinks: ts });
            } catch (error) {
                console.error('Failed to load Value/Effort data', error);
            }
        };
        loadData();
    }, []);

    return (
        <DashboardWidget widget={widget} className={className || "col-span-1 md:col-span-2"} dragHandleProps={dragHandleProps}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-500 mb-1">{stats.quickWins}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-green-700/70 dark:text-green-400 uppercase tracking-widest truncate max-w-full px-2">Quick Wins</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-500 mb-1">{stats.strategicBets}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-blue-700/70 dark:text-blue-400 uppercase tracking-widest truncate max-w-full px-2">Strategic Bets</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/10 p-5 rounded-xl border border-yellow-100 dark:border-yellow-900/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-3xl sm:text-4xl font-extrabold text-yellow-600 dark:text-yellow-500 mb-1">{stats.fillers}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-yellow-700/70 dark:text-yellow-400 uppercase tracking-widest truncate max-w-full px-2">Fillers</span>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/50 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-3xl sm:text-4xl font-extrabold text-red-600 dark:text-red-500 mb-1">{stats.timeSinks}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-red-700/70 dark:text-red-400 uppercase tracking-widest truncate max-w-full px-2">Time Sinks</span>
                </div>
            </div>
        </DashboardWidget>
    );
}
