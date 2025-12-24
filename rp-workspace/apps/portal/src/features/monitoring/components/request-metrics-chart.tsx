'use client';

import { MetricsSummary } from '../service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Simple visualization without recharts for now
// To add charts, install: npm install recharts

interface RequestMetricsChartProps {
    metrics: MetricsSummary;
}

export function RequestMetricsChart({ metrics }: RequestMetricsChartProps) {
    // Prepare data for chart
    const statusCodeData = Object.entries(metrics.requests.byStatusCode).map(([code, count]) => ({
        code: code,
        count: count,
        label: `${code}xx`,
    }));

    // Top endpoints by request count
    const topEndpoints = Object.entries(metrics.requests.byEndpoint)
        .map(([endpoint, data]) => ({
            endpoint: endpoint.split(':')[1] || endpoint, // Remove method prefix
            count: data.count,
            avgResponseTime: data.avgResponseTime,
            errors: data.errors,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Metrics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Status Code Distribution */}
                    <div>
                        <h3 className="text-sm font-medium mb-4">Status Code Distribution</h3>
                        <div className="space-y-2">
                            {statusCodeData.map((item) => (
                                <div key={item.code} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-sm font-bold">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Endpoints */}
                    <div>
                        <h3 className="text-sm font-medium mb-4">Top Endpoints</h3>
                        <div className="space-y-2">
                            {topEndpoints.map((endpoint) => (
                                <div key={endpoint.endpoint} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{endpoint.endpoint}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {endpoint.avgResponseTime.toFixed(0)}ms avg
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">{endpoint.count}</p>
                                        {endpoint.errors > 0 && (
                                            <p className="text-xs text-red-500">{endpoint.errors} errors</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

