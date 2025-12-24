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
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { CreateRequirementForm } from '@/features/requirements/components/create-requirement-form';
import { toast } from 'sonner';

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
    const [selectedEpicId, setSelectedEpicId] = useState('');

    // Catalog Data
    const [methods, setMethods] = useState<VerificationMethod[]>([]);
    const [allEpics, setAllEpics] = useState<Epic[]>([]);
    const [users, setUsers] = useState<Sponsor[]>([]);
    const [priorities, setPriorities] = useState<any[]>([]);
    const [complexities, setComplexities] = useState<any[]>([]);
    const [riskLevels, setRiskLevels] = useState<any[]>([]);
    const [effortTypes, setEffortTypes] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any[]>([]);
    const [productOwners, setProductOwners] = useState<any[]>([]);
    const [approvers, setApprovers] = useState<any[]>([]);

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
            const [m, p, c, r, et, met, e, u, po, app] = await Promise.all([
                CatalogsService.getVerificationMethods(),
                CatalogsService.getPriorities(),
                CatalogsService.getComplexities(),
                CatalogsService.getRiskLevels(),
                CatalogsService.getEffortTypes(),
                CatalogsService.getMetrics(),
                EpicsService.getAll({ limit: 100 }),
                SponsorsService.getAll(),
                CatalogsService.getProductOwners(),
                CatalogsService.getApprovers()
            ]);
            setMethods(m);
            setPriorities(p);
            setComplexities(c);
            setRiskLevels(r);
            setEffortTypes(et);
            setMetrics(met);
            setAllEpics(e.items || []);
            setUsers(u || []);
            setProductOwners(po);
            setApprovers(app);
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

    const handleCreateSuccess = async (data: any) => {
        setCreating(true);
        try {
            await RequirementsService.create(data);
            setOpenCreate(false);
            setSelectedEpicId('');
            toast.success('Requisito creado exitosamente');
            
            // Refresh if the created requirement belongs to current filter
            if (data.epicId && selectedContextEpicIds.includes(data.epicId)) {
                fetchData();
            } else if (selectedContextEpicIds.length > 0) {
                fetchData();
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el requisito';
            toast.error(errorMessage);
            throw error;
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

                            {/* Context Info (Read-Only) */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4 pb-4 border-b">
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
                            </div>

                            <CreateRequirementForm
                                onSuccess={handleCreateSuccess}
                                onCancel={() => {
                                    setOpenCreate(false);
                                    setSelectedEpicId('');
                                }}
                                methods={methods}
                                priorities={priorities}
                                complexities={complexities}
                                riskLevels={riskLevels}
                                effortTypes={effortTypes}
                                metrics={metrics}
                                epics={selectedContextEpicIds.length === 1 
                                    ? contextEpics.filter(e => selectedContextEpicIds.includes(e.epicId))
                                    : contextEpics.filter(e => selectedContextEpicIds.includes(e.epicId))
                                }
                                users={users}
                                productOwners={productOwners}
                                approvers={approvers}
                                defaultEpicId={selectedContextEpicIds.length === 1 ? selectedContextEpicIds[0] : undefined}
                                creating={creating}
                            />
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
