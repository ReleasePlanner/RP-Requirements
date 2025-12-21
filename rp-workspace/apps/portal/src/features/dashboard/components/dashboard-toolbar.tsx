import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List, Search, Filter } from 'lucide-react';

interface DashboardToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    filterType: string;
    onFilterChange: (value: string) => void;
}

export function DashboardToolbar({
    searchTerm,
    onSearchChange,
    viewMode,
    onViewModeChange,
    sortBy,
    onSortChange,
    filterType,
    onFilterChange
}: DashboardToolbarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-6">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search widgets..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={filterType} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-[140px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="STATS_OVERVIEW">Stats</SelectItem>
                        <SelectItem value="CHART">Charts</SelectItem>
                        <SelectItem value="ACTIVITY">Activity</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="alphabetical">Name (A-Z)</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center border rounded-md">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('grid')}
                        className="h-9 w-9 rounded-none rounded-l-md"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('list')}
                        className="h-9 w-9 rounded-none rounded-r-md"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
