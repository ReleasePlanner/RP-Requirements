'use client';

import { EpicList } from '@/features/epics/components/epic-list';
import { Epic } from '@/features/epics/types';
import { EpicsService } from '@/features/epics/service';
import { InitiativesService } from '@/features/initiatives/service';
import { CatalogsService } from '@/features/catalogs/service';
import { Initiative } from '@/features/initiatives/types';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCcw, Plus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EpicsPage() {
    const [items, setItems] = useState<Epic[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    // Create Modal
    const [openCreate, setOpenCreate] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form Fields
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [businessCaseLink, setBusinessCaseLink] = useState('');
    const [actualCost, setActualCost] = useState('');
    const [selectedInitiativeId, setSelectedInitiativeId] = useState('');


    // Lookups
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await EpicsService.getAll({
                page,
                limit,
                sortBy,
                sortOrder
            });
            setItems(result.items || []);
            setTotal(result.total || 0);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLookups = async () => {
        try {
            const [initiativeData] = await Promise.all([
                InitiativesService.getAll({ limit: 100 })
            ]);
            setInitiatives(initiativeData.items || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchLookups();
    }, [page, limit, sortBy, sortOrder]);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(field);
            setSortOrder('ASC');
        }
    };

    const handleCreate = async () => {
        if (!name) return;
        setCreating(true);
        try {
            await EpicsService.create({
                name,
                goal,
                businessCaseLink,
                actualCost: actualCost ? parseFloat(actualCost) : undefined,
                initiativeId: selectedInitiativeId || undefined,

            });
            setOpenCreate(false);

            // Reset
            setName('');
            setGoal('');
            setBusinessCaseLink('');
            setActualCost('');
            setSelectedInitiativeId('');


            fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setCreating(false);
        }
    }

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col gap-6 w-full mb-6 relative">
                <div className="px-6 pt-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Epics</h1>
                        <p className="text-zinc-500 text-sm mt-1">Break down initiatives into manageable epics.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 lg:px-4">
                    <div className="relative w-full md:flex-1 md:max-w-sm group">
                        <input
                            type="text"
                            className="block w-full py-2 bg-transparent border-b border-zinc-200 text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-black transition-colors text-sm"
                            placeholder="Search epics..."
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <span className="text-xs text-zinc-500 font-mono">
                            {total} records
                        </span>

                        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                            <DialogTrigger asChild>
                                <Button className="bg-black text-white hover:bg-zinc-800 gap-2">
                                    <Plus className="h-4 w-4" /> Create Epic
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create Epic</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name *</Label>
                                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. User Authentication" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Goal</Label>
                                        <Textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Describe the goal..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Initiative</Label>
                                            <Select value={selectedInitiativeId} onValueChange={setSelectedInitiativeId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Initiative" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {initiatives.map(i => (
                                                        <SelectItem key={i.initiativeId} value={i.initiativeId}>{i.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Actual Cost ($)</Label>
                                            <Input type="number" value={actualCost} onChange={e => setActualCost(e.target.value)} placeholder="0.00" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Business Case Link</Label>
                                            <Input value={businessCaseLink} onChange={e => setBusinessCaseLink(e.target.value)} placeholder="https://..." />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setOpenCreate(false)}>Cancel</Button>
                                    <Button onClick={handleCreate} disabled={creating || !name}>
                                        {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full overflow-hidden flex flex-col">
                <EpicList
                    data={items}
                    onSort={handleSort}
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                />

                <div className="h-14 border-t border-zinc-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
                    <span className="text-xs text-zinc-400 font-medium">
                        Page {page} of {totalPages || 1}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || loading}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
