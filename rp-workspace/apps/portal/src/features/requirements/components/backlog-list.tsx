'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Requirement } from '../types';
import { cn } from '@/lib/utils';
import { Edit2 } from 'lucide-react';

interface BacklogListProps {
    data: Requirement[];
    onSort?: (field: string) => void;
    currentSort?: string;
    currentOrder?: 'ASC' | 'DESC';
}

// SortIcon component moved outside to avoid recreating during render
function SortIcon({ field, currentSort, currentOrder }: { field: string; currentSort?: string; currentOrder?: 'ASC' | 'DESC' }) {
    if (currentSort !== field) return <div className="ml-1 w-3 h-3 opacity-0 group-hover:opacity-30 inline-block bg-zinc-300 rounded-sm" />;
    return (
        <span className="ml-1 text-zinc-800 text-[9px]">
            {currentOrder === 'ASC' ? '▲' : '▼'}
        </span>
    );
}

export function BacklogList({ data, onSort, currentSort, currentOrder }: BacklogListProps) {

    if (!data || data.length === 0) {
        return <div className="p-12 text-center text-zinc-400 text-sm italic font-serif">No items in the backlog</div>;
    }

    return (
        <div className="w-full px-6 overflow-auto h-full">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-zinc-100/50 hover:bg-transparent sticky top-0 bg-zinc-50/95 backdrop-blur z-10">
                        <TableHead
                            className="w-[80px] text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-6 pb-4 pt-6 cursor-pointer group hover:text-black transition-colors"
                            onClick={() => onSort?.('id')}
                        >
                            ID <SortIcon field="id" currentSort={currentSort} currentOrder={currentOrder} />
                        </TableHead>
                        <TableHead
                            className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6 cursor-pointer group hover:text-black transition-colors"
                            onClick={() => onSort?.('name')}
                        >
                            Requirement <SortIcon field="name" currentSort={currentSort} currentOrder={currentOrder} />
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6 cursor-pointer group hover:text-black transition-colors" onClick={() => onSort?.('priority')}>Priority <SortIcon field="priority" currentSort={currentSort} currentOrder={currentOrder} /></TableHead>
                        <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6 cursor-pointer group hover:text-black transition-colors" onClick={() => onSort?.('effortEstimate')}>Effort <SortIcon field="effortEstimate" currentSort={currentSort} currentOrder={currentOrder} /></TableHead>
                        <TableHead className="text-right text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pr-6 pb-4 pt-6">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.requirementId} className="border-b border-zinc-100 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 group cursor-default h-20">
                            <TableCell className="text-[11px] font-medium text-zinc-400 pl-6 py-4">{item.code || 'REQ'}</TableCell>
                            <TableCell className="max-w-[400px] py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium text-[15px] text-zinc-900 group-hover:text-black transition-colors">{item.title}</span>
                                    {item.storyStatement && (
                                        <span className="text-xs text-zinc-400 font-light truncate max-w-[300px]">{item.storyStatement}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className={cn(
                                    "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide border transition-all",
                                    item.priority?.name === 'High' ? "border-zinc-800 text-zinc-900 bg-zinc-50" :
                                        item.priority?.name === 'Medium' ? "border-zinc-300 text-zinc-600" :
                                            "border-zinc-200 text-zinc-400"
                                )}>
                                    {item.priority?.name || 'Unassigned'}
                                </div>
                            </TableCell>

                            <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                    {item.productOwner ? (
                                        <div className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                                            {item.productOwner.firstName.charAt(0)}
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 rounded-full border border-dashed border-zinc-200"></div>
                                    )}
                                    <span className="text-[12px] font-medium text-zinc-500">
                                        {item.productOwner ? `${item.productOwner.firstName} ${item.productOwner.lastName}` : 'Unassigned'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-400">
                                    <span className="text-zinc-600 font-semibold">{item.effortEstimate ? `${item.effortEstimate} pts` : '-'}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right pr-6 py-4">
                                <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-black hover:bg-zinc-100 transition-all duration-300 opacity-50 cursor-not-allowed" disabled title="Editing disabled">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
