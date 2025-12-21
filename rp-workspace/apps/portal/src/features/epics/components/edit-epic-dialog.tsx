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
import { Epic } from '../types';
import { InitiativesService } from '@/features/initiatives/service';
import { Initiative } from '@/features/initiatives/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EditEpicDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    epic?: Epic;
    onSuccess: () => void;
}

export function EditEpicDialog({ open, onOpenChange, epic, onSuccess }: EditEpicDialogProps) {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [initiativeId, setInitiativeId] = useState('');
    const [saving, setSaving] = useState(false);
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('ACTIVE');

    useEffect(() => {
        if (open && epic) {
            setError(null);
            setName(epic.name);
            setGoal(epic.goal || '');
            setInitiativeId(epic.initiativeId || '');
            setStatus(epic.status_text || 'ACTIVE');
            InitiativesService.getAll({ limit: 100 }).then(res => setInitiatives(res.items));
        }
    }, [open, epic]);

    const handleSave = async () => {
        if (!epic || !name || !initiativeId) return;
        setSaving(true);
        try {
            await EpicsService.update(epic.epicId, {
                name,
                goal,
                initiativeId,
                status_text: status
            });
            onSuccess();
            onOpenChange(false);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to update epic.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Epic</DialogTitle>
                    <DialogDescription>Update epic details.</DialogDescription>
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
                        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. User Auth" />
                    </div>
                    <div className="space-y-2">
                        <Label>Goal</Label>
                        <Textarea value={goal} onChange={e => setGoal(e.target.value)} placeholder="Epic goal..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Initiative *</Label>
                        <Select value={initiativeId} onValueChange={setInitiativeId}>
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
                    <Button onClick={handleSave} disabled={saving || !name || !initiativeId}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
