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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { EpicsService } from '../service';
import { InitiativesService } from '@/features/initiatives/service';
import { Initiative } from '@/features/initiatives/types';

interface CreateEpicDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initiativeId?: string; // Pre-selected
    onSuccess: () => void;
}

export function CreateEpicDialog({ open, onOpenChange, initiativeId, onSuccess }: CreateEpicDialogProps) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [selectedInitiativeId, setSelectedInitiativeId] = useState(initiativeId || '');
    const [creating, setCreating] = useState(false);
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);

    useEffect(() => {
        if (open) {
            setName('');
            setGoal('');
            setSelectedInitiativeId(initiativeId || '');
            if (!initiativeId) {
                InitiativesService.getAll({ limit: 100 }).then(res => setInitiatives(res.items));
            }
        }
    }, [open, initiativeId]);

    const handleCreate = async () => {
        if (!name || !selectedInitiativeId) return;
        setCreating(true);
        try {
            await EpicsService.create({
                name,
                goal,
                initiativeId: selectedInitiativeId,
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
                    <DialogTitle>Create Epic</DialogTitle>
                    <DialogDescription>
                        Break down your initiative into manageable epics.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. User Auth" />
                    </div>
                    <div className="space-y-2">
                        <Label>Goal</Label>
                        <Textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Epic goal..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Initiative *</Label>
                        <Select value={selectedInitiativeId} onValueChange={setSelectedInitiativeId} disabled={!!initiativeId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Initiative" />
                            </SelectTrigger>
                            <SelectContent>
                                {initiativeId ? (
                                    <SelectItem value={initiativeId}>Current Initiative</SelectItem>
                                ) : (
                                    initiatives.map(i => (
                                        <SelectItem key={i.initiativeId} value={i.initiativeId}>{i.title}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={creating || !name || !selectedInitiativeId}>
                        {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
