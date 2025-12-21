import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { InitiativesService } from '../service';
import { PortfolioService } from '@/features/portfolio/service';
import { Portfolio } from '@/features/portfolio/types';

interface CreateInitiativeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    portfolioId?: string; // Pre-selected
    onSuccess: () => void;
}

export function CreateInitiativeDialog({ open, onOpenChange, portfolioId, onSuccess }: CreateInitiativeDialogProps) {
    const [title, setTitle] = useState('');
    const [strategicGoal, setStrategicGoal] = useState('');
    const [selectedPortfolioId, setSelectedPortfolioId] = useState(portfolioId || '');
    const [creating, setCreating] = useState(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

    useEffect(() => {
        if (open) {
            setTitle('');
            setStrategicGoal('');
            setSelectedPortfolioId(portfolioId || '');
            if (!portfolioId) {
                // Fetch portfolios if not pre-selected
                PortfolioService.getAll({ limit: 100 }).then(res => setPortfolios(res.items));
            }
        }
    }, [open, portfolioId]);

    const handleCreate = async () => {
        if (!title || !selectedPortfolioId) return;
        setCreating(true);
        try {
            await InitiativesService.create({
                title,
                strategicGoal,
                portfolioId: selectedPortfolioId,
                statusId: undefined // Default
            });
            onSuccess();
            onOpenChange(false);
        } catch (e) {
            console.error(e);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Initiative</DialogTitle>
                    <DialogDescription>
                        Add a new initiative to the portfolio. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Cloud Migration" />
                    </div>
                    <div className="space-y-2">
                        <Label>Strategic Goal</Label>
                        <Input value={strategicGoal} onChange={e => setStrategicGoal(e.target.value)} placeholder="Describe the goal..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Portfolio *</Label>
                        <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId} disabled={!!portfolioId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Portfolio" />
                            </SelectTrigger>
                            <SelectContent>
                                {portfolioId ? (
                                    <SelectItem value={portfolioId}>Current Portfolio</SelectItem>
                                ) : (
                                    portfolios.map(p => (
                                        <SelectItem key={p.portfolioId} value={p.portfolioId}>{p.name}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={creating || !title || !selectedPortfolioId}>
                        {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
