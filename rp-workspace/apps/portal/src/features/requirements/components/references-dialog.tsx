'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { ReferencesTab } from './references-tab';
import { Requirement } from '../types';
import { useState } from 'react';

interface ReferencesDialogProps {
    requirement: Requirement;
    trigger?: React.ReactNode;
}

export function ReferencesDialog({ requirement, trigger }: ReferencesDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" title="References">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-[800px] bg-white">
                <DialogHeader>
                    <DialogTitle>References for {requirement.code || 'Requirement'}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <ReferencesTab requirementId={requirement.requirementId} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
