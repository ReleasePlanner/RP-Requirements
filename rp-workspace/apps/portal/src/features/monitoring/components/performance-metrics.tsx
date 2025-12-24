'use client';

import { DetailedHealth } from '../service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Server, Cpu, HardDrive } from 'lucide-react';

interface PerformanceMetricsProps {
    health: DetailedHealth;
}

export function PerformanceMetrics({ health }: PerformanceMetricsProps) {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const memoryUsagePercent = health.memory.heapTotal > 0
        ? (health.memory.heapUsed / health.memory.heapTotal) * 100
        : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Performance Metrics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Memory Usage */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Memory Usage</span>
                            <span className="text-sm text-muted-foreground">
                                {formatBytes(health.memory.heapUsed)} / {formatBytes(health.memory.heapTotal)}
                            </span>
                        </div>
                        <Progress value={memoryUsagePercent} className="h-2" />
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>Used: {formatBytes(health.memory.heapUsed)}</span>
                            <span>Max: {formatBytes(health.memory.max.heapUsed)}</span>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">CPU Usage</span>
                            </div>
                            <span className="text-sm font-medium">
                                User: {formatBytes(health.system.cpu.user)} | System: {formatBytes(health.system.cpu.system)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <HardDrive className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">RSS Memory</span>
                            </div>
                            <span className="text-sm font-medium">
                                {formatBytes(health.system.memory.rss)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm">Node Version</span>
                            <span className="text-sm font-medium">{health.system.nodeVersion}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm">Platform</span>
                            <span className="text-sm font-medium">{health.system.platform}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm">Process ID</span>
                            <span className="text-sm font-medium">{health.system.pid}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

