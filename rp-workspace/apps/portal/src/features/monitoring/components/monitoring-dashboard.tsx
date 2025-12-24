'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MonitoringService, MetricsSummary, DetailedHealth } from '../service';
import { MetricsCards } from './metrics-cards';
import { RequestMetricsChart } from './request-metrics-chart';
import { ErrorMetricsTable } from './error-metrics-table';
import { PerformanceMetrics } from './performance-metrics';
import { SystemResources } from './system-resources';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const REFRESH_INTERVAL = 10000; // 10 seconds

export function MonitoringDashboard() {
    const [timeWindow, setTimeWindow] = useState<number | undefined>(300); // 5 minutes default
    const [autoRefresh, setAutoRefresh] = useState(true);

    const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
        queryKey: ['monitoring-metrics', timeWindow],
        queryFn: () => MonitoringService.getMetrics(timeWindow),
        refetchInterval: autoRefresh ? REFRESH_INTERVAL : false,
    });

    const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
        queryKey: ['monitoring-health'],
        queryFn: () => MonitoringService.getDetailedHealth(),
        refetchInterval: autoRefresh ? REFRESH_INTERVAL : false,
    });

    const isLoading = metricsLoading || healthLoading;

    const handleRefresh = () => {
        refetchMetrics();
        refetchHealth();
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Select
                        value={timeWindow?.toString() || 'all'}
                        onValueChange={(value) => setTimeWindow(value === 'all' ? undefined : parseInt(value))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Time window" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="60">Last minute</SelectItem>
                            <SelectItem value="300">Last 5 minutes</SelectItem>
                            <SelectItem value="900">Last 15 minutes</SelectItem>
                            <SelectItem value="3600">Last hour</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Status Alert */}
            {health && health.status !== 'ok' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                        <p className="font-medium text-red-900 dark:text-red-100">System Health Alert</p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            The system is experiencing issues. Please check the metrics below.
                        </p>
                    </div>
                </div>
            )}

            {/* Metrics Cards */}
            {metrics && <MetricsCards metrics={metrics} health={health} />}

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {metrics && <RequestMetricsChart metrics={metrics} />}
                {health && <PerformanceMetrics health={health} />}
            </div>

            {/* System Resources */}
            {health && <SystemResources health={health} />}

            {/* Error Metrics */}
            {metrics && <ErrorMetricsTable metrics={metrics} />}
        </div>
    );
}

