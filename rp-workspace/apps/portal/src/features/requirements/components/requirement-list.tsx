'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Requirement } from '../types';
import { EditRequirementDialog } from './edit-dialog';
import { ReferencesDialog } from './references-dialog';
import { cn } from '@/lib/utils';
import { Edit2, Trash2, Send, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RequirementListProps {
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

export function RequirementList({ data, onSort, currentSort, currentOrder }: RequirementListProps) {

    if (!data || data.length === 0) {
        return <div className="p-12 text-center text-zinc-400 text-sm italic font-serif">No requirements found</div>;
    }

    return (
        <div className="w-full px-6 overflow-auto h-full">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-zinc-100/50 hover:bg-transparent sticky top-0 bg-zinc-50/95 backdrop-blur z-10">
                        <TableHead
                            className="w-[80px] text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-6 pb-4 pt-6 cursor-pointer group hover:text-black transition-colors"
                            onClick={() => onSort?.('code')}
                        >
                            ID <SortIcon field="code" currentSort={currentSort} currentOrder={currentOrder} />
                        </TableHead>
                        <TableHead
                            className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6 cursor-pointer group hover:text-black transition-colors"
                            onClick={() => onSort?.('title')}
                        >
                            Requirement <SortIcon field="title" currentSort={currentSort} currentOrder={currentOrder} />
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6 cursor-pointer group hover:text-black transition-colors">Priority</TableHead>
                        <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6 cursor-pointer group hover:text-black transition-colors">Effort</TableHead>
                        <TableHead className="text-right text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pr-6 pb-4 pt-6">Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => {
                        const priorityName = item.priority?.name || 'Unassigned';
                        const poName = item.productOwner ? `${item.productOwner.firstName} ${item.productOwner.lastName}` : 'Unassigned';

                        return (
                            <TableRow key={item.requirementId} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors duration-200 group cursor-default h-16">
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
                                    <Badge variant="outline" className={cn(
                                        "font-normal text-[10px] px-2.5 py-0.5 h-6 min-w-[70px] justify-center",
                                        priorityName === 'High' ? "border-red-200 text-red-700 bg-red-50/10" :
                                            priorityName === 'Medium' ? "border-orange-200 text-orange-700 bg-orange-50/10" :
                                                "border-zinc-200 text-zinc-500 bg-zinc-50/50"
                                    )}>
                                        {priorityName}
                                    </Badge>
                                </TableCell>

                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        {item.productOwner ? (
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                                                {poName.charAt(0)}
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full border border-dashed border-zinc-200"></div>
                                        )}
                                        <span className="text-[12px] font-medium text-zinc-500">{poName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-400">
                                        <span className="text-zinc-600 font-semibold">{item.effortEstimate ? `${item.effortEstimate} pts` : '-'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <EditRequirementDialog
                                            requirement={item}
                                            trigger={
                                                <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300" title="Edit">
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                            }
                                        />
                                        <ReferencesDialog
                                            requirement={item}
                                            trigger={
                                                <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300" title="References">
                                                    <Paperclip className="h-4 w-4" />
                                                </button>
                                            }
                                        />
                                        <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-600 hover:bg-red-50 transition-all duration-300" title="Delete">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                        <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-green-600 hover:bg-green-50 transition-all duration-300" title="Publish">
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
