'use client';

import { MonitoringDashboard } from '@/features/monitoring/components/monitoring-dashboard';

export default function MonitoringPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Monitoring</h1>
                <p className="text-muted-foreground">
                    Real-time monitoring of API performance, errors, and system resources.
                </p>
            </div>

            <MonitoringDashboard />
        </div>
    );
}

