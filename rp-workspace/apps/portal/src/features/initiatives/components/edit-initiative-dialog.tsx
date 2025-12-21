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
import { Initiative } from '../types';
import { PortfolioService } from '@/features/portfolio/service';
import { Portfolio } from '@/features/portfolio/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditInitiativeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initiative?: Initiative;
    onSuccess: () => void;
}

export function EditInitiativeDialog({ open, onOpenChange, initiative, onSuccess }: EditInitiativeDialogProps) {
    const [title, setTitle] = useState('');
    const [strategicGoal, setStrategicGoal] = useState('');
    const [portfolioId, setPortfolioId] = useState('');
    const [saving, setSaving] = useState(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('ACTIVE');

    useEffect(() => {
        if (open && initiative) {
            setError(null);
            setTitle(initiative.title);
            setStrategicGoal(initiative.strategicGoal || '');
            setPortfolioId(initiative.portfolioId || '');
            setStatus(initiative.status_text || initiative.status?.name || 'ACTIVE');
            PortfolioService.getAll({ limit: 100 }).then(res => setPortfolios(res.items));
        }
    }, [open, initiative]);

    const handleSave = async () => {
        if (!initiative || !title || !portfolioId) return;
        setSaving(true);
        try {
            await InitiativesService.update(initiative.initiativeId, {
                title,
                strategicGoal,
                portfolioId,
                status_text: status
            });
            onSuccess();
            onOpenChange(false);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to update initiative.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Initiative</DialogTitle>
                    <DialogDescription>Update initiative details.</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

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
                        <Select value={portfolioId} onValueChange={setPortfolioId}>
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
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
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
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={saving || !title || !portfolioId}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
