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
import { PortfolioService } from '../service';
import { Portfolio } from '../types';
import { SponsorsService, Sponsor } from '@/features/sponsors/service';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditPortfolioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    portfolio?: Portfolio;
    onSuccess: () => void;
}

export function EditPortfolioDialog({ open, onOpenChange, portfolio, onSuccess }: EditPortfolioDialogProps) {
    const [name, setName] = useState('');
    const [sponsorId, setSponsorId] = useState('');
    const [saving, setSaving] = useState(false);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState('ACTIVE');

    useEffect(() => {
        if (open && portfolio) {
            setError(null);
            setName(portfolio.name);
            setSponsorId(portfolio.sponsorId || '');
            setStatus(portfolio.status || 'ACTIVE');
            SponsorsService.getAll().then(setSponsors).catch(console.error);
        }
    }, [open, portfolio]);

    const handleSave = async () => {
        if (!portfolio || !name) return;
        setSaving(true);
        try {
            await PortfolioService.update(portfolio.portfolioId, {
                name,
                sponsorId: sponsorId || undefined,
                status
            });
            onSuccess();
            onOpenChange(false);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to update portfolio.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Portfolio</DialogTitle>
                    <DialogDescription>Update portfolio details.</DialogDescription>
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
                        <Label>Name *</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Digital Transformation" />
                    </div>
                    <div className="space-y-2">
                        <Label>Sponsor</Label>
                        <Select value={sponsorId} onValueChange={setSponsorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a sponsor" />
                            </SelectTrigger>
                            <SelectContent>
                                {sponsors.map(s => (
                                    <SelectItem key={s.sponsorId} value={s.sponsorId}>{s.name}</SelectItem>
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
                    <Button onClick={handleSave} disabled={saving || !name}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
