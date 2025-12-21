'use client';

import { InitiativeList } from '@/features/initiatives/components/initiative-list';
import { Initiative } from '@/features/initiatives/types';
import { InitiativesService } from '@/features/initiatives/service';
import { CatalogsService } from '@/features/catalogs/service';
import { PortfolioService } from '@/features/portfolio/service';

import { Portfolio } from '@/features/portfolio/types';
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

export default function InitiativesPage() {
    const [items, setItems] = useState<Initiative[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    // Create Modal State
    const [openCreate, setOpenCreate] = useState(false);
    const [creating, setCreating] = useState(false);

    // Form Fields
    const [title, setTitle] = useState('');
    const [strategicGoal, setStrategicGoal] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [estimatedROI, setEstimatedROI] = useState('');
    const [selectedPortfolioId, setSelectedPortfolioId] = useState('');


    // Catalogs & Lookups

    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await InitiativesService.getAll({
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
            const [portfolioData] = await Promise.all([
                PortfolioService.getAll({ limit: 100 }) // Fetch top 100 for dropdown
            ]);
            setPortfolios(portfolioData.items || []);
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
        if (!title) return;
        setCreating(true);
        try {
            await InitiativesService.create({
                title,
                strategicGoal,
                estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
                estimatedROI: estimatedROI ? parseFloat(estimatedROI) : undefined,
                portfolioId: selectedPortfolioId || undefined,

            });
            setOpenCreate(false);

            // Reset Form
            setTitle('');
            setStrategicGoal('');
            setEstimatedCost('');
            setEstimatedROI('');
            setSelectedPortfolioId('');


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
                        <h1 className="text-2xl font-bold tracking-tight">Initiatives</h1>
                        <p className="text-zinc-500 text-sm mt-1">Track high-level business initiatives.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 lg:px-4">
                    <div className="relative w-full md:flex-1 md:max-w-sm group">
                        <input
                            type="text"
                            className="block w-full py-2 bg-transparent border-b border-zinc-200 text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-black transition-colors text-sm"
                            placeholder="Search initiatives..."
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
                                    <Plus className="h-4 w-4" /> Create Initiative
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Create Initiative</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label>Title *</Label>
                                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Q4 Marketing Push" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Strategic Goal</Label>
                                            <Input value={strategicGoal} onChange={e => setStrategicGoal(e.target.value)} placeholder="e.g. Increase Market Share" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Portfolio</Label>
                                            <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Portfolio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {portfolios.map(p => (
                                                        <SelectItem key={p.portfolioId} value={p.portfolioId}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Estimated Cost ($)</Label>
                                            <Input type="number" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} placeholder="0.00" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Estimated ROI (%)</Label>
                                            <Input type="number" value={estimatedROI} onChange={e => setEstimatedROI(e.target.value)} placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setOpenCreate(false)}>Cancel</Button>
                                    <Button onClick={handleCreate} disabled={creating || !title}>
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
                <InitiativeList
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
