'use client';

import { MetricsSummary, DetailedHealth } from '../service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, Clock, Server, TrendingUp, Zap } from 'lucide-react';

interface MetricsCardsProps {
    metrics: MetricsSummary;
    health?: DetailedHealth;
}

export function MetricsCards({ metrics, health }: MetricsCardsProps) {
    const errorRate = metrics.requests.total > 0
        ? (metrics.errors.total / metrics.requests.total) * 100
        : 0;

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const cards = [
        {
            title: 'Total Requests',
            value: metrics.requests.total.toLocaleString(),
            icon: Activity,
            description: `Avg: ${metrics.requests.avgResponseTime.toFixed(0)}ms`,
            trend: null,
        },
        {
            title: 'Error Rate',
            value: `${errorRate.toFixed(2)}%`,
            icon: AlertTriangle,
            description: `${metrics.errors.total} errors`,
            trend: errorRate > 5 ? 'negative' : 'positive',
            className: errorRate > 5 ? 'border-red-500' : '',
        },
        {
            title: 'Avg Response Time',
            value: `${metrics.requests.avgResponseTime.toFixed(0)}ms`,
            icon: Clock,
            description: 'Average response time',
            trend: metrics.requests.avgResponseTime > 1000 ? 'negative' : 'positive',
        },
        {
            title: 'Uptime',
            value: formatUptime(metrics.uptime),
            icon: Server,
            description: 'System uptime',
            trend: null,
        },
        {
            title: 'Memory Usage',
            value: health
                ? formatBytes(health.memory.heapUsed)
                : formatBytes(metrics.performance.current?.heapUsed || 0),
            icon: Zap,
            description: health
                ? `Max: ${formatBytes(health.memory.max.heapUsed)}`
                : `Max: ${formatBytes(metrics.performance.max.heapUsed)}`,
            trend: health && health.memory.heapUsed / health.memory.heapTotal > 0.9 ? 'negative' : 'positive',
        },
        {
            title: 'Success Rate',
            value: `${(100 - errorRate).toFixed(2)}%`,
            icon: TrendingUp,
            description: 'Request success rate',
            trend: errorRate < 1 ? 'positive' : 'neutral',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card key={card.title} className={card.className}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

