import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Widget } from '../types';

interface DashboardWidgetProps {
    widget: Widget;
    children: React.ReactNode;
    className?: string;
    dragHandleProps?: any; // For dnd-kit later
}

export function DashboardWidget({ widget, children, className, dragHandleProps }: DashboardWidgetProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Card className={cn("transition-all duration-200", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <div className="grid-drag-handle cursor-grab hover:text-primary active:cursor-grabbing touch-none p-1 rounded-md hover:bg-muted">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-sm font-medium">
                        {widget.title}
                    </CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronUp className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle</span>
                </Button>
            </CardHeader>
            {!isCollapsed && (
                <CardContent>
                    {children}
                </CardContent>
            )}
        </Card>
    );
}
