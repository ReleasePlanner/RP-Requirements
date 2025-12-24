'use client';

import { MetricsSummary } from '../service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface ErrorMetricsTableProps {
    metrics: MetricsSummary;
}

export function ErrorMetricsTable({ metrics }: ErrorMetricsTableProps) {
    const errorTypes = Object.entries(metrics.errors.byType)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

    const recentErrors = metrics.errors.recent.slice(0, 10);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Error Metrics
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Error Types */}
                    {errorTypes.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-4">Error Types</h3>
                            <div className="flex flex-wrap gap-2">
                                {errorTypes.map(({ type, count }) => (
                                    <Badge key={type} variant="destructive">
                                        {type}: {count}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Errors */}
                    {recentErrors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium mb-4">Recent Errors</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Endpoint</TableHead>
                                        <TableHead>Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentErrors.map((error, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {new Date(error.timestamp).toLocaleTimeString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{error.errorType}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs">{error.method} {error.endpoint}</code>
                                            </TableCell>
                                            <TableCell className="max-w-md truncate">
                                                {error.message}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {metrics.errors.total === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>No errors recorded</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

