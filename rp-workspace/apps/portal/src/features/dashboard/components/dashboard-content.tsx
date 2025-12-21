'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { WidgetsService } from '../service';
import { Widget, WidgetType } from '../types';
import { StatsOverview } from './stats-overview';
import { RequirementsChart } from './requirements-chart';
import { RecentActivity } from './recent-activity';
import { PriorityChart } from './priority-chart';
import { ValueEffortWidget } from './value-effort-widget';
import { PortfolioHealthWidget } from './portfolio-health-widget';
import { Loader2 } from 'lucide-react';
import { DashboardToolbar } from './dashboard-toolbar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// @ts-ignore
const { Responsive } = require('react-grid-layout');

interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
}

export function DashboardContent() {
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [layouts, setLayouts] = useState<{ [key: string]: LayoutItem[] }>({ lg: [], md: [], sm: [] });

    // Custom WidthProvider logic
    const [width, setWidth] = useState(1200);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    // Toolbar State
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('default');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        const loadWidgets = async () => {
            try {
                const fetchedWidgets = await WidgetsService.getAll();
                const activeWidgets = fetchedWidgets.filter(w => w.isVisible);
                setWidgets(activeWidgets);

                // Load saved layout
                const savedLayouts = localStorage.getItem('dashboard_layouts');
                if (savedLayouts) {
                    try {
                        setLayouts(JSON.parse(savedLayouts));
                    } catch (e) {
                        console.error('Failed to parse saved layouts', e);
                        generateDefaultLayouts(activeWidgets);
                    }
                } else {
                    generateDefaultLayouts(activeWidgets);
                }
            } catch (error) {
                console.error('Failed to load dashboard widgets', error);
                toast.error('Failed to load dashboard widgets');
            } finally {
                setIsLoading(false);
            }
        };
        loadWidgets();
    }, []);

    const generateDefaultLayouts = (items: Widget[]) => {
        // Simple auto-layout generation
        const lg = items.map((w, i) => {
            const isWide = w.type === WidgetType.STATS_OVERVIEW || w.type.includes('CHART') || w.type === WidgetType.VALUE_EFFORT_MATRIX || w.type === WidgetType.RECENT_ACTIVITY;
            const width = w.type === WidgetType.STATS_OVERVIEW ? 12 : (isWide ? 6 : 4);
            return {
                i: w.widgetId,
                x: (i * 4) % 12,
                y: Math.floor(i / 3),
                w: width,
                h: w.type === WidgetType.STATS_OVERVIEW ? 2 : 8,
                minW: 3,
                minH: 4
            };
        });
        setLayouts({ lg, md: lg, sm: lg });
    };

    const handleLayoutChange = (currentLayout: LayoutItem[], allLayouts: { [key: string]: LayoutItem[] }) => {
        setLayouts(allLayouts);
        localStorage.setItem('dashboard_layouts', JSON.stringify(allLayouts));
    };

    const filteredWidgets = useMemo(() => {
        return widgets
            .filter(w => {
                if (searchTerm && !w.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                if (filterType !== 'ALL') {
                    if (filterType === 'STATS_OVERVIEW' && w.type !== WidgetType.STATS_OVERVIEW) return false;
                    if (filterType === 'CHART' && !w.type.includes('CHART')) return false;
                    if (filterType === 'ACTIVITY' && w.type !== WidgetType.RECENT_ACTIVITY) return false;
                }
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
                return 0;
            });
    }, [widgets, searchTerm, filterType, sortBy]);

    const renderWidgetContent = (widget: Widget) => {
        const commonProps = { widget, className: "h-full" };

        switch (widget.type) {
            case WidgetType.STATS_OVERVIEW: return <StatsOverview {...commonProps} />;
            case WidgetType.REQUIREMENTS_CHART: return <RequirementsChart {...commonProps} />;
            case WidgetType.RECENT_ACTIVITY: return <RecentActivity {...commonProps} />;
            case WidgetType.PRIORITY_CHART: return <PriorityChart {...commonProps} />;
            case WidgetType.VALUE_EFFORT_MATRIX: return <ValueEffortWidget {...commonProps} />;
            case WidgetType.PORTFOLIO_HEALTH: return <PortfolioHealthWidget {...commonProps} />;
            default: return null;
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const isGridActive = viewMode === 'grid' && sortBy === 'default' && filterType === 'ALL' && searchTerm === '';

    return (
        <div className="space-y-6" ref={containerRef}>
            <DashboardToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterType={filterType}
                onFilterChange={setFilterType}
            />

            {isGridActive ? (
                <Responsive
                    className="layout"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={30}
                    width={width}
                    draggableHandle=".grid-drag-handle"
                    onLayoutChange={handleLayoutChange}
                    isDraggable={true}
                    isResizable={true}
                    margin={[16, 16]}
                >
                    {filteredWidgets.map(widget => (
                        <div key={widget.widgetId} className="bg-background rounded-lg border shadow-sm">
                            {renderWidgetContent(widget)}
                        </div>
                    ))}
                </Responsive>
            ) : (
                <div className={cn(
                    "grid gap-4",
                    viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
                )}>
                    {filteredWidgets.map(widget => (
                        <div key={widget.widgetId} className="h-full">
                            {renderWidgetContent(widget)}
                        </div>
                    ))}
                    {filteredWidgets.length === 0 && <div className="col-span-full text-center text-muted-foreground py-8">No widgets match your criteria.</div>}
                </div>
            )}
        </div>
    );
}
