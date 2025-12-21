'use client';

import { Portfolio } from '../types';
import { Initiative } from '@/features/initiatives/types';
import { Epic } from '@/features/epics/types';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target, Flag, MoreVertical, Edit2, Trash2, Plus, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PortfolioTreeProps {
    data: Portfolio[];
    initiatives: Record<string, Initiative[]>;
    epics: Record<string, Epic[]>;
    expandedPortfolios: Set<string>;
    expandedInitiatives: Set<string>;
    loadingNodes: Set<string>;

    onTogglePortfolio: (id: string) => void;
    onToggleInitiative: (id: string) => void;

    onEditPortfolio: (portfolio: Portfolio) => void;
    onDeletePortfolio: (id: string) => void;
    onCreateInitiative: (portfolioId: string) => void;
    onEditInitiative: (initiative: Initiative) => void;
    onDeleteInitiative: (id: string) => void;
    onCreateEpic: (initiativeId: string) => void;
    onEditEpic: (epic: Epic) => void;
    onDeleteEpic: (id: string) => void;
}

export const PortfolioTree = ({
    data,
    initiatives,
    epics,
    expandedPortfolios,
    expandedInitiatives,
    loadingNodes,
    onTogglePortfolio,
    onToggleInitiative,
    onEditPortfolio,
    onDeletePortfolio,
    onCreateInitiative,
    onEditInitiative,
    onDeleteInitiative,
    onCreateEpic,
    onEditEpic,
    onDeleteEpic
}: PortfolioTreeProps) => {

    const containerVariants = {
        hidden: { opacity: 1 }, // DEBUG: Changed from 0 to 1
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 1, y: 0 }, // DEBUG: Changed from opacity 0, y 20
        show: { opacity: 1, y: 0 }
    };

    if (!data || !Array.isArray(data)) {
        return <div className="p-8 text-center text-zinc-500">No portfolios available.</div>;
    }

    return (
        <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {data.map(portfolio => (
                <PortfolioCard
                    key={portfolio.portfolioId}
                    portfolio={portfolio}
                    isExpanded={expandedPortfolios.has(portfolio.portfolioId)}
                    isLoading={loadingNodes.has(portfolio.portfolioId)}
                    initiatives={initiatives[portfolio.portfolioId] ?? portfolio.initiatives ?? []}
                    epics={epics}
                    expandedInitiatives={expandedInitiatives}
                    loadingNodes={loadingNodes}
                    onToggle={() => onTogglePortfolio(portfolio.portfolioId)}
                    onToggleInitiative={onToggleInitiative}
                    onEdit={() => onEditPortfolio(portfolio)}
                    onDelete={() => onDeletePortfolio(portfolio.portfolioId)}
                    onCreateInitiative={() => onCreateInitiative(portfolio.portfolioId)}
                    onEditInitiative={onEditInitiative}
                    onDeleteInitiative={onDeleteInitiative}
                    onCreateEpic={onCreateEpic}
                    onEditEpic={onEditEpic}
                    onDeleteEpic={onDeleteEpic}
                    variants={itemVariants}
                />
            ))}
        </motion.div>
    );
};

// --- Components ---

const PortfolioCard = ({
    portfolio, isExpanded, isLoading, initiatives, epics, expandedInitiatives, loadingNodes,
    onToggle, onToggleInitiative, onEdit, onDelete, onCreateInitiative,
    onEditInitiative, onDeleteInitiative, onCreateEpic, onEditEpic, onDeleteEpic, variants
}: any) => {

    // Status Color Helper
    const getStatusColor = (status: string) => {
        const s = (status || '').toUpperCase();
        if (s === 'ACTIVE') return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
        if (s === 'INACTIVE') return 'bg-zinc-100 text-zinc-500 hover:bg-zinc-100';
        return 'bg-blue-50 text-blue-700 hover:bg-blue-50';
    };

    return (
        <motion.div
            variants={variants}
            className={cn(
                "group rounded-xl border border-zinc-200/60 bg-white transition-all duration-200",
                isExpanded ? "shadow-md ring-1 ring-black/5" : "hover:shadow-sm hover:border-zinc-300"
            )}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-5 cursor-pointer select-none"
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                        isExpanded ? "bg-black text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
                    )}>
                        <ChevronRight className={cn("h-5 w-5 transition-transform duration-200", isExpanded && "rotate-90")} />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-zinc-900 text-lg">{portfolio.name}</h3>
                            <Badge className={cn("font-medium border-0 rounded-md px-2 py-0.5 text-xs", getStatusColor(portfolio.status))}>
                                {portfolio.status || 'Draft'}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(portfolio.creationDate).getFullYear()}</span>
                            </div>
                            <span>•</span>
                            <span>{portfolio.sponsor?.name || 'No Sponsor'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={e => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="h-8 gap-2 rounded-full px-4 text-xs font-medium" onClick={onCreateInitiative}>
                        <Plus className="h-3 w-3" /> New Initiative
                    </Button>
                    <ActionMenu onEdit={onEdit} onDelete={onDelete} type="Portfolio" />
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-zinc-50/50"
                    >
                        <div className="p-4 pt-0 pl-[4.5rem] pr-4 pb-4">
                            {isLoading ? (
                                <div className="py-4 text-sm text-zinc-400">Loading initiatives...</div>
                            ) : initiatives.length === 0 ? (
                                <div className="py-8 text-center border-2 border-dashed border-zinc-200 rounded-lg text-sm text-zinc-400">
                                    No initiatives yet. Click "New Initiative" to start.
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {initiatives.map((initiative: Initiative) => (
                                        <InitiativeCard
                                            key={initiative.initiativeId}
                                            initiative={initiative}
                                            epics={epics}
                                            isExpanded={expandedInitiatives.has(initiative.initiativeId)}
                                            loadingNodes={loadingNodes}
                                            onToggle={() => onToggleInitiative(initiative.initiativeId)}
                                            onEdit={() => onEditInitiative(initiative)}
                                            onDelete={() => onDeleteInitiative(initiative.initiativeId)}
                                            onCreateEpic={() => onCreateEpic(initiative.initiativeId)}
                                            onEditEpic={onEditEpic}
                                            onDeleteEpic={onDeleteEpic}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const InitiativeCard = ({ initiative, epics, isExpanded, loadingNodes, onToggle, onEdit, onDelete, onCreateEpic, onEditEpic, onDeleteEpic }: any) => {
    return (
        <motion.div
            layout
            className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden"
        >
            <div className="flex items-center justify-between p-3 hover:bg-zinc-50 transition-colors cursor-pointer" onClick={onToggle}>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-600">
                        <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                    </Button>
                    <div className="p-1.5 bg-purple-100 rounded text-purple-600">
                        <Target className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-900">{initiative.title}</span>
                            {initiative.status_text && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{initiative.status_text}</Badge>
                            )}
                        </div>
                        <span className="text-xs text-zinc-500">ROI: ${initiative.estimatedROI?.toLocaleString() ?? 0}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-zinc-600 hover:text-black" onClick={onCreateEpic}>
                        <Plus className="h-3 w-3" /> Epic
                    </Button>
                    <ActionMenu onEdit={onEdit} onDelete={onDelete} type="Initiative" />
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-zinc-50 border-t border-zinc-100"
                    >
                        <div className="p-3 pl-14">
                            {(epics[initiative.initiativeId] ?? initiative.epics ?? []).length === 0 ? (
                                <div className="text-xs text-zinc-400 italic py-2">No epics found.</div>
                            ) : (
                                <div className="space-y-1">
                                    {(epics[initiative.initiativeId] ?? initiative.epics ?? []).map((epic: Epic) => (
                                        <EpicItem
                                            key={epic.epicId}
                                            epic={epic}
                                            onEdit={() => onEditEpic(epic)}
                                            onDelete={() => onDeleteEpic(epic.epicId)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const EpicItem = ({ epic, onEdit, onDelete }: any) => {
    return (
        <motion.div
            layout
            className="flex items-center justify-between p-2 rounded-md hover:bg-white hover:shadow-sm border border-transparent hover:border-zinc-200 transition-all group"
        >
            <div className="flex items-center gap-3">
                <Flag className="h-3.5 w-3.5 text-orange-500" />
                <div className="flex flex-col">
                    <span className="text-sm text-zinc-700 font-medium">{epic.name}</span>
                    {epic.status_text && <span className="text-[10px] text-zinc-400">{epic.status_text}</span>}
                </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ActionMenu onEdit={onEdit} onDelete={onDelete} type="Epic" simple />
            </div>
        </motion.div>
    )
}

const ActionMenu = ({ onEdit, onDelete, type, simple }: any) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className={cn("text-zinc-400 hover:text-black", simple ? "h-6 w-6" : "h-8 w-8")}>
                <MoreVertical className={cn("transition-transform group-active:scale-95", simple ? "h-3.5 w-3.5" : "h-4 w-4")} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit}>
                <Edit2 className="mr-2 h-4 w-4" /> Edit {type}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);
