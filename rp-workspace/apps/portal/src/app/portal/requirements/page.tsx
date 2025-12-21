'use client';

import { RequirementList } from '@/features/requirements/components/requirement-list';
import { Requirement } from '@/features/requirements/types';
import { RequirementsService } from '@/features/requirements/service';
import { CatalogsService } from '@/features/catalogs/service';
import { SponsorsService, Sponsor } from '@/features/sponsors/service';
import { EpicsService } from '@/features/epics/service';
import { PortfolioService } from '@/features/portfolio/service';
import { InitiativesService } from '@/features/initiatives/service';
import { VerificationMethod } from '@/features/catalogs/types';
import { Epic } from '@/features/epics/types';
import { Portfolio } from '@/features/portfolio/types';
import { Initiative } from '@/features/initiatives/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, RefreshCcw, Plus, Filter } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

export default function RequirementsPage() {
    // Filter State
    const [contextPortfolios, setContextPortfolios] = useState<Portfolio[]>([]);
    const [contextInitiatives, setContextInitiatives] = useState<Initiative[]>([]);
    const [contextEpics, setContextEpics] = useState<Epic[]>([]);

    const [selectedContextPortfolioId, setSelectedContextPortfolioId] = useState<string>('');
    const [selectedContextInitiativeId, setSelectedContextInitiativeId] = useState<string>('');
    const [selectedContextEpicIds, setSelectedContextEpicIds] = useState<string[]>([]);

    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    // Create Modal Fields
    const [openCreate, setOpenCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [storyStatement, setStoryStatement] = useState('');
    const [isMandatory, setIsMandatory] = useState(false);
    const [effortEstimate, setEffortEstimate] = useState('');
    const [goLiveDate, setGoLiveDate] = useState('');
    const [changeHistoryLink, setChangeHistoryLink] = useState('');
    const [requirementVersion, setRequirementVersion] = useState('1.0');

    const [selectedMethodId, setSelectedMethodId] = useState('');
    const [selectedPriorityId, setSelectedPriorityId] = useState('');
    const [selectedEpicId, setSelectedEpicId] = useState('');
    const [selectedProductOwnerId, setSelectedProductOwnerId] = useState('');
    const [selectedApproverId, setSelectedApproverId] = useState('');

    // Catalog Data
    const [methods, setMethods] = useState<VerificationMethod[]>([]);
    const [allEpics, setAllEpics] = useState<Epic[]>([]); // For create modal
    const [users, setUsers] = useState<Sponsor[]>([]);
    const [priorities, setPriorities] = useState<any[]>([]);

    // 1. Fetch Portfolios on Mount
    useEffect(() => {
        const loadPortfolios = async () => {
            try {
                const res = await PortfolioService.getAll({ limit: 100 });
                setContextPortfolios(res.items);
            } catch (e) { console.error(e); }
        };
        loadPortfolios();
        fetchLookups();
    }, []);

    // 2. Fetch Initiatives when Portfolio changes
    useEffect(() => {
        if (!selectedContextPortfolioId) {
            setContextInitiatives([]);
            setSelectedContextInitiativeId('');
            return;
        }
        const loadInitiatives = async () => {
            try {
                const res = await InitiativesService.getAll({ portfolioId: selectedContextPortfolioId, limit: 100 });
                setContextInitiatives(res.items);
                setSelectedContextInitiativeId(''); // Reset child
            } catch (e) { console.error(e); }
        };
        loadInitiatives();
    }, [selectedContextPortfolioId]);

    // 3. Fetch Epics when Initiative changes
    useEffect(() => {
        if (!selectedContextInitiativeId) {
            setContextEpics([]);
            setSelectedContextEpicIds([]);
            return;
        }
        const loadEpics = async () => {
            try {
                const res = await EpicsService.getAll({ initiativeId: selectedContextInitiativeId, limit: 100 });
                setContextEpics(res.items);
                setSelectedContextEpicIds([]); // Reset child
            } catch (e) { console.error(e); }
        };
        loadEpics();
    }, [selectedContextInitiativeId]);

    // 4. Fetch Requirements only when filters change and are valid
    useEffect(() => {
        if (selectedContextEpicIds.length === 0) {
            setRequirements([]);
            setTotal(0);
            return;
        }
        fetchData();
    }, [selectedContextEpicIds, page, limit, sortBy, sortOrder]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await RequirementsService.getAll({
                page,
                limit,
                sortBy,
                sortOrder,
                epicIds: selectedContextEpicIds
            });
            setRequirements(result.items || []);
            setTotal(result.total || 0);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLookups = async () => {
        try {
            const [m, p, e, u] = await Promise.all([
                CatalogsService.getVerificationMethods(),
                CatalogsService.getPriorities(),
                EpicsService.getAll({ limit: 100 }), // Keep fetching all for create modal or optimize later
                SponsorsService.getAll()
            ]);
            setMethods(m);
            setPriorities(p);
            setAllEpics(e.items || []);
            setUsers(u || []);
        } catch (error) {
            console.error(error);
        }
    };

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
            await RequirementsService.create({
                title,
                storyStatement,
                isMandatory,
                effortEstimate: effortEstimate ? parseFloat(effortEstimate) : undefined,
                goLiveDate: goLiveDate || undefined,
                changeHistoryLink,
                requirementVersion,
                verificationMethodId: selectedMethodId ? parseInt(selectedMethodId) : undefined,
                priorityId: selectedPriorityId ? parseInt(selectedPriorityId) : undefined,
                epicId: selectedEpicId || undefined,
                productOwnerId: selectedProductOwnerId || undefined,
                approverId: selectedApproverId || undefined,
            });
            setOpenCreate(false);
            // Reset
            setTitle('');
            setStoryStatement('');
            setEffortEstimate('');
            setGoLiveDate('');
            setChangeHistoryLink('');
            setSelectedMethodId('');
            setSelectedPriorityId('');
            setSelectedEpicId('');
            setSelectedProductOwnerId('');
            setSelectedApproverId('');

            // Refresh if the created requirement belongs to current filter
            if (selectedContextEpicIds.includes(selectedEpicId)) {
                fetchData();
            }
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
                        <h1 className="text-2xl font-bold tracking-tight">Requirements</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage and track system requirements.</p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="px-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label className="text-xs">Portfolio</Label>
                        <Select value={selectedContextPortfolioId} onValueChange={setSelectedContextPortfolioId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Portfolio" />
                            </SelectTrigger>
                            <SelectContent>
                                {contextPortfolios.map(p => <SelectItem key={p.portfolioId} value={p.portfolioId}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Initiative</Label>
                        <Select value={selectedContextInitiativeId} onValueChange={setSelectedContextInitiativeId} disabled={!selectedContextPortfolioId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Initiative" />
                            </SelectTrigger>
                            <SelectContent>
                                {contextInitiatives.map(i => <SelectItem key={i.initiativeId} value={i.initiativeId}>{i.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Epic(s)</Label>
                        <MultiSelect
                            options={contextEpics.map(e => ({ label: e.name, value: e.epicId }))}
                            onValueChange={setSelectedContextEpicIds}
                            defaultValue={selectedContextEpicIds}
                            placeholder="Select Epics"
                            variant="inverted"
                            disabled={!selectedContextInitiativeId}
                        />
                    </div>
                    <div className="flex items-center gap-2 pb-1">
                        <span className="text-xs text-zinc-500 font-mono">
                            {total} records
                        </span>
                        <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading || selectedContextEpicIds.length === 0}>
                            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <div className="px-6">
                    <Dialog open={openCreate} onOpenChange={(open) => {
                        if (open) {
                            // Set default epic if only one is selected in context
                            if (selectedContextEpicIds.length === 1) {
                                setSelectedEpicId(selectedContextEpicIds[0]);
                            } else {
                                setSelectedEpicId('');
                            }
                        }
                        setOpenCreate(open);
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-black text-white hover:bg-zinc-800 gap-2" disabled={selectedContextEpicIds.length === 0}>
                                <Plus className="h-4 w-4" /> Create Requirement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[900px] overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>Create Requirement</DialogTitle>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                                {/* Context Info (Read-Only) */}
                                <div className="space-y-2">
                                    <Label>Portfolio</Label>
                                    <Input
                                        value={contextPortfolios.find(p => p.portfolioId === selectedContextPortfolioId)?.name || ''}
                                        readOnly
                                        disabled
                                        className="bg-zinc-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Initiative</Label>
                                    <Input
                                        value={contextInitiatives.find(i => i.initiativeId === selectedContextInitiativeId)?.title || ''}
                                        readOnly
                                        disabled
                                        className="bg-zinc-50"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Epic</Label>
                                    {selectedContextEpicIds.length === 1 ? (
                                        <Input
                                            value={contextEpics.find(e => e.epicId === selectedContextEpicIds[0])?.name || ''}
                                            readOnly
                                            disabled
                                            className="bg-zinc-50"
                                        />
                                    ) : (
                                        <Select value={selectedEpicId} onValueChange={setSelectedEpicId}>
                                            <SelectTrigger><SelectValue placeholder="Select Epic" /></SelectTrigger>
                                            <SelectContent>
                                                {/* Show only epics that are currently selected in the filter context, or all context epics if none selected (fallback) - adhering to user request to choose from selected */}
                                                {contextEpics
                                                    .filter(e => selectedContextEpicIds.includes(e.epicId))
                                                    .map(e => <SelectItem key={e.epicId} value={e.epicId}>{e.name}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                                {/* Primary Info */}
                                <div className="col-span-2 space-y-2">
                                    <Label>Title *</Label>
                                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. User Login Page" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Description / Story Statement</Label>
                                    <Textarea value={storyStatement} onChange={e => setStoryStatement(e.target.value)} placeholder="As a user..." className="h-20" />
                                </div>

                                {/* Classification */}
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select value={selectedPriorityId} onValueChange={setSelectedPriorityId}>
                                        <SelectTrigger><SelectValue placeholder="Select Priority" /></SelectTrigger>
                                        <SelectContent>{priorities.map(p => <SelectItem key={p.priorityId} value={p.priorityId?.toString()}>{p.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>

                                {/* Governance */}
                                <div className="space-y-2">
                                    <Label>Verification Method</Label>
                                    <Select value={selectedMethodId} onValueChange={setSelectedMethodId}>
                                        <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                                        <SelectContent>{methods.map(m => <SelectItem key={m.verificationMethodId} value={m.verificationMethodId?.toString()}>{m.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>

                                {/* Roles */}
                                <div className="space-y-2">
                                    <Label>Product Owner</Label>
                                    <Select value={selectedProductOwnerId} onValueChange={setSelectedProductOwnerId}>
                                        <SelectTrigger><SelectValue placeholder="Select PO" /></SelectTrigger>
                                        <SelectContent>{users.map(u => <SelectItem key={u.sponsorId} value={u.sponsorId}>{u.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Approver</Label>
                                    <Select value={selectedApproverId} onValueChange={setSelectedApproverId}>
                                        <SelectTrigger><SelectValue placeholder="Select Approver" /></SelectTrigger>
                                        <SelectContent>{users.map(u => <SelectItem key={u.sponsorId} value={u.sponsorId}>{u.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>

                                {/* Linkage */}
                                {/* Linkage */}
                                <div className="space-y-2">
                                    <Label>Version</Label>
                                    <Input value={requirementVersion} onChange={e => setRequirementVersion(e.target.value)} />
                                </div>

                                {/* Metadata */}
                                <div className="space-y-2">
                                    <Label>Effort (Points)</Label>
                                    <Input type="number" value={effortEstimate} onChange={e => setEffortEstimate(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Go Live Date</Label>
                                    <Input type="date" value={goLiveDate} onChange={e => setGoLiveDate(e.target.value)} />
                                </div>

                                <div className="col-span-2 flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="mandatory"
                                        checked={isMandatory}
                                        onChange={(e) => setIsMandatory(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <Label htmlFor="mandatory">Is Mandatory?</Label>
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

            <div className="flex-1 w-full overflow-hidden flex flex-col">
                {selectedContextEpicIds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center">
                        <Filter className="h-10 w-10 mb-4 opacity-20" />
                        <p>Select Portfolio, Initiative, and at least one Epic to view requirements.</p>
                    </div>
                ) : (
                    <>
                        <RequirementList
                            data={requirements}
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
                    </>
                )}
            </div>
        </div>
    );
}
