'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Epic } from '../types';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EpicsService } from '../service';
import { useRouter } from 'next/navigation';

interface EpicListProps {
    data: Epic[];
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

export function EpicList({ data, onSort, currentSort, currentOrder }: EpicListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this epic?')) {
            try {
                await EpicsService.delete(id);
                router.refresh();
                window.location.reload();
            } catch (e) {
                console.error(e);
            }
        }
    }

    if (!data || data.length === 0) {
        return <div className="p-12 text-center text-zinc-400 text-sm italic font-serif">No epics found</div>;
    }

    return (
        <div className="w-full px-6 overflow-auto h-full">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-zinc-100/50 hover:bg-transparent sticky top-0 bg-zinc-50/95 backdrop-blur z-10">
                        <TableHead className="w-[300px] text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pl-6 pb-4 pt-6 cursor-pointer" onClick={() => onSort?.('name')}>
                            Name <SortIcon field="name" currentSort={currentSort} currentOrder={currentOrder} />
                        </TableHead>
                        <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6">Initiative</TableHead>

                        <TableHead className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pb-4 pt-6">Goal</TableHead>
                        <TableHead className="text-right text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] pr-6 pb-4 pt-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.epicId} className="border-b border-zinc-100 hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-500 group cursor-default h-16">
                            <TableCell className="text-[14px] font-medium text-zinc-900 pl-6 py-4">
                                {item.name}
                            </TableCell>
                            <TableCell className="py-4 text-sm text-zinc-600">
                                {item.initiative?.title || '-'}
                            </TableCell>

                            <TableCell className="py-4 text-sm text-zinc-600 max-w-[200px] truncate" title={item.goal}>
                                {item.goal || '-'}
                            </TableCell>
                            <TableCell className="text-right pr-6 py-4">
                                <div className="flex justify-end gap-2">
                                    <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-black hover:bg-zinc-100 transition-all duration-300">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.epicId)} className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-600 hover:bg-red-50 transition-all duration-300">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
