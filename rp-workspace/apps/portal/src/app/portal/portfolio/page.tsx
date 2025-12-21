'use client';

import { PortfolioTree } from '@/features/portfolio/components/portfolio-tree';
import { Portfolio } from '@/features/portfolio/types';
import { PortfolioService } from '@/features/portfolio/service';
import { InitiativesService } from '@/features/initiatives/service';
import { EpicsService } from '@/features/epics/service';
import { Initiative } from '@/features/initiatives/types';
import { Epic } from '@/features/epics/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RefreshCcw, Plus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SponsorsService, Sponsor } from '@/features/sponsors/service';
import { CreateInitiativeDialog } from '@/features/initiatives/components/create-initiative-dialog';
import { CreateEpicDialog } from '@/features/epics/components/create-epic-dialog';
import { EditPortfolioDialog } from '@/features/portfolio/components/edit-portfolio-dialog';
import { EditInitiativeDialog } from '@/features/initiatives/components/edit-initiative-dialog';
import { EditEpicDialog } from '@/features/epics/components/edit-epic-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PortfolioPage() {
    // Data
    const [items, setItems] = useState<Portfolio[]>([]);
    const [filteredItems, setFilteredItems] = useState<Portfolio[]>([]);
    const [initiatives, setInitiatives] = useState<Record<string, Initiative[]>>({});
    const [epics, setEpics] = useState<Record<string, Epic[]>>({});
    const [expandedPortfolios, setExpandedPortfolios] = useState<Set<string>>(new Set());
    const [expandedInitiatives, setExpandedInitiatives] = useState<Set<string>>(new Set());
    const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<Sponsor[]>([]);

    // View & Filter States
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    // Create Portfolio Modal
    const [openCreate, setOpenCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newSponsorId, setNewSponsorId] = useState('');
    const [newStatus, setNewStatus] = useState('ACTIVE');
    const [creating, setCreating] = useState(false);

    // Create Child Dialogs
    const [showCreateInitiative, setShowCreateInitiative] = useState(false);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState('');

    const [showCreateEpic, setShowCreateEpic] = useState(false);
    const [selectedInitiativeId, setSelectedInitiativeId] = useState('');

    // Edit states
    const [showEditPortfolio, setShowEditPortfolio] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | undefined>(undefined);

    const [showEditInitiative, setShowEditInitiative] = useState(false);
    const [editingInitiative, setEditingInitiative] = useState<Initiative | undefined>(undefined);

    const [showEditEpic, setShowEditEpic] = useState(false);
    const [editingEpic, setEditingEpic] = useState<Epic | undefined>(undefined);

    // Delete state
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<'portfolio' | 'initiative' | 'epic' | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await PortfolioService.getAll({
                page,
                limit,
                sortBy,
                sortOrder
            });
            console.log('PortfolioPage Fetched Result:', result);
            setItems(result.items || []);
            setTotal(result.total || 0);
        } catch (error: any) {
            console.error("Failed to fetch", error);
            setError(error.message || "Failed to load portfolios. Please try again.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Client-side filtering
    useEffect(() => {
        let res = items;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(p => p.name.toLowerCase().includes(q));
        }
        if (statusFilter !== 'ALL') {
            res = res.filter(p => (p.status || 'DRAFT').toUpperCase() === statusFilter);
        }
        setFilteredItems(res);
    }, [items, searchQuery, statusFilter]);

    useEffect(() => {
        fetchData();
        SponsorsService.getAll().then(setUsers).catch(console.error);
    }, [page, limit, sortBy, sortOrder]);

    const handleCreatePortfolio = async () => {
        if (!newName) return;
        setCreating(true);
        try {
            // Include status in creation
            await PortfolioService.create({
                name: newName,
                sponsorId: newSponsorId || undefined,
                status: newStatus
            });
            setOpenCreate(false);
            setNewName('');
            setNewSponsorId('');
            setNewStatus('ACTIVE');
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Failed to create portfolio. Please check console.");
        } finally {
            setCreating(false);
        }
    }

    // Toggle Logic
    const togglePortfolio = async (id: string) => {
        const newExpanded = new Set(expandedPortfolios);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedPortfolios(newExpanded);

        // Fetch if expanding and missing
        if (!newExpanded.has(id)) return;

        if (!initiatives[id]) {
            await refreshInitiatives(id);
        }
    };

    const refreshInitiatives = async (portfolioId: string) => {
        setLoadingNodes(prev => new Set(prev).add(portfolioId));
        try {
            const result = await InitiativesService.getAll({ portfolioId, limit: 100 });
            setInitiatives(prev => ({ ...prev, [portfolioId]: result.items }));
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingNodes(prev => {
                const next = new Set(prev);
                next.delete(portfolioId);
                return next;
            });
        }
    }

    const toggleInitiative = async (id: string) => {
        const newExpanded = new Set(expandedInitiatives);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedInitiatives(newExpanded);

        // Fetch if expanding and missing
        if (!newExpanded.has(id)) return;

        if (!epics[id]) {
            await refreshEpics(id);
        }
    };

    const refreshEpics = async (initiativeId: string) => {
        setLoadingNodes(prev => new Set(prev).add(initiativeId));
        try {
            const result = await EpicsService.getAll({ initiativeId, limit: 100 });
            setEpics(prev => ({ ...prev, [initiativeId]: result.items }));
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingNodes(prev => {
                const next = new Set(prev);
                next.delete(initiativeId);
                return next;
            });
        }
    }

    // Handlers
    const onOpenCreateInitiative = (portfolioId: string) => {
        setSelectedPortfolioId(portfolioId);
        setShowCreateInitiative(true);
    };

    const onOpenCreateEpic = (initiativeId: string) => {
        setSelectedInitiativeId(initiativeId);
        setShowCreateEpic(true);
    }

    // Open Edit Handlers
    const onOpenEditPortfolio = (p: Portfolio) => {
        setEditingPortfolio(p);
        setShowEditPortfolio(true);
    };

    const onOpenEditInitiative = (i: Initiative) => {
        setEditingInitiative(i);
        setShowEditInitiative(true);
    };

    const onOpenEditEpic = (e: Epic) => {
        setEditingEpic(e);
        setShowEditEpic(true);
    };

    // Open Delete Handlers
    const onOpenDeletePortfolio = (id: string) => {
        setDeleteType('portfolio');
        setDeleteId(id);
        setDeleteAlertOpen(true);
    };

    const onOpenDeleteInitiative = (id: string) => {
        setDeleteType('initiative');
        setDeleteId(id);
        setDeleteAlertOpen(true);
    };

    const onOpenDeleteEpic = (id: string) => {
        setDeleteType('epic');
        setDeleteId(id);
        setDeleteAlertOpen(true);
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!deleteId || !deleteType) return;
        setIsDeleting(true);
        try {
            if (deleteType === 'portfolio') {
                await PortfolioService.delete(deleteId);
                fetchData();
            } else if (deleteType === 'initiative') {
                await InitiativesService.delete(deleteId);
                // Find parent to refresh
                const parentId = Object.keys(initiatives).find(pid => initiatives[pid].some(i => i.initiativeId === deleteId));
                if (parentId) refreshInitiatives(parentId);
            } else if (deleteType === 'epic') {
                await EpicsService.delete(deleteId);
                // Find parent to refresh
                const parentId = Object.keys(epics).find(iid => epics[iid].some(e => e.epicId === deleteId));
                if (parentId) refreshEpics(parentId);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to delete. Check console.");
        } finally {
            setIsDeleting(false);
            setDeleteAlertOpen(false);
            setDeleteId(null);
            setDeleteType(null);
        }
    };


    const totalPages = Math.ceil(total / limit);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex flex-col gap-6 w-full mb-6 relative">
                <div className="px-6 pt-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Portfolios</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage strategic portfolios and initiatives.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 px-2 lg:px-4">
                    {/* Controls Row */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 max-w-lg">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full py-2 bg-transparent border-b border-zinc-200 text-zinc-800 placeholder-zinc-300 focus:outline-none focus:border-black transition-colors text-sm"
                                    placeholder="Search portfolios..."
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[120px] h-9 text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* View Toggles (Mock visual for now) */}
                            <div className="border border-zinc-200 rounded-md p-0.5 flex bg-zinc-50">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 w-7 p-0 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-7 w-7 p-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </Button>
                            </div>

                            <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>

                            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                                <DialogTrigger asChild>
                                    <Button className="bg-black text-white hover:bg-zinc-800 gap-2">
                                        <Plus className="h-4 w-4" /> Create Portfolio
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Create Portfolio</DialogTitle>
                                        <DialogDescription>
                                            Create a new portfolio to organize initiatives and projects.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Portfolio Name</Label>
                                            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Digital Transformation" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <Select value={newStatus} onValueChange={setNewStatus}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Sponsor</Label>
                                            <Select value={newSponsorId} onValueChange={setNewSponsorId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a sponsor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {users.map(user => (
                                                        <SelectItem key={user.sponsorId} value={user.sponsorId}>
                                                            {user.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreatePortfolio} disabled={creating}>
                                            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Create
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full overflow-hidden flex flex-col px-6 pb-6">
                {/* Pass View Mode if supported, or just List for now. Grid not implemented yet in Tree, so 'grid' will effectively just trigger rendering data differently if I modify Tree, but for now I keep it as list but structurally ready. */}
                {/* Error State */}
                {error && (
                    <div className="mx-6 p-4 mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                        <p className="font-semibold">Error loading data:</p>
                        <p>{error}</p>
                        <Button variant="outline" size="sm" onClick={fetchData} className="mt-2 bg-white border-red-200 hover:bg-red-50 text-red-700">
                            Retry
                        </Button>
                    </div>
                )}

                <PortfolioTree
                    data={filteredItems}
                    initiatives={initiatives}
                    epics={epics}
                    expandedPortfolios={expandedPortfolios}
                    expandedInitiatives={expandedInitiatives}
                    loadingNodes={loadingNodes}
                    onTogglePortfolio={togglePortfolio}
                    onToggleInitiative={toggleInitiative}
                    onEditPortfolio={onOpenEditPortfolio}
                    onDeletePortfolio={onOpenDeletePortfolio}
                    onCreateInitiative={onOpenCreateInitiative}
                    onEditInitiative={onOpenEditInitiative}
                    onDeleteInitiative={onOpenDeleteInitiative}
                    onCreateEpic={onOpenCreateEpic}
                    onEditEpic={onOpenEditEpic}
                    onDeleteEpic={onOpenDeleteEpic}
                />

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">
                        Page {page} of {totalPages || 1} ({filteredItems.length} filtered of {total} total)
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

            <CreateInitiativeDialog
                open={showCreateInitiative}
                onOpenChange={setShowCreateInitiative}
                portfolioId={selectedPortfolioId}
                onSuccess={() => refreshInitiatives(selectedPortfolioId)}
            />

            <CreateEpicDialog
                open={showCreateEpic}
                onOpenChange={setShowCreateEpic}
                initiativeId={selectedInitiativeId}
                onSuccess={() => refreshEpics(selectedInitiativeId)}
            />

            <EditPortfolioDialog
                open={showEditPortfolio}
                onOpenChange={setShowEditPortfolio}
                portfolio={editingPortfolio}
                onSuccess={fetchData}
            />

            <EditInitiativeDialog
                open={showEditInitiative}
                onOpenChange={setShowEditInitiative}
                initiative={editingInitiative}
                onSuccess={() => {
                    const pid = editingInitiative?.portfolioId;
                    if (pid) refreshInitiatives(pid);
                }}
            />

            <EditEpicDialog
                open={showEditEpic}
                onOpenChange={setShowEditEpic}
                epic={editingEpic}
                onSuccess={() => {
                    const iid = editingEpic?.initiativeId;
                    if (iid) refreshEpics(iid);
                }}
            />

            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected item and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e: React.MouseEvent) => { e.preventDefault(); confirmDelete(); }} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
