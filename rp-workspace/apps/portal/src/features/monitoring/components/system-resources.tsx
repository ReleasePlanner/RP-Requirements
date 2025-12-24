'use client';

import { DetailedHealth } from '../service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface SystemResourcesProps {
    health: DetailedHealth;
}

export function SystemResources({ health }: SystemResourcesProps) {
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (days > 0) return `${days} days, ${hours} hours`;
        if (hours > 0) return `${hours} hours, ${minutes} minutes`;
        return `${minutes} minutes`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                        <p className="text-lg font-semibold">{formatUptime(health.uptime)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">RSS Memory</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.memory.rss)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Heap Used</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.memory.heapUsed)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Heap Total</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.memory.heapTotal)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">External</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.memory.external)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Array Buffers</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.memory.arrayBuffers)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">CPU User</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.cpu.user)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">CPU System</p>
                        <p className="text-lg font-semibold">{formatBytes(health.system.cpu.system)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

