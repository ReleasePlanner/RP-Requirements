'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sponsor } from '../service';

interface SponsorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sponsorToEdit?: Sponsor | null;
    onSave: (data: Partial<Sponsor> & { password?: string }) => Promise<void>;
}

export function SponsorDialog({
    open,
    onOpenChange,
    sponsorToEdit,
    onSave,
}: SponsorDialogProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Sponsor');
    const [isActive, setIsActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (sponsorToEdit) {
                setName(sponsorToEdit.name);
                setEmail(sponsorToEdit.email);
                setRole(sponsorToEdit.role || 'Sponsor');
                setIsActive(sponsorToEdit.isActive !== undefined ? sponsorToEdit.isActive : true);
                setPassword(''); // Don't show password for edit
            } else {
                setName('');
                setEmail('');
                setPassword('');
                setRole('Sponsor');
                setIsActive(true);
            }
        }
    }, [open, sponsorToEdit]);

    const handleSave = async () => {
        if (!name.trim() || !email.trim() || (!sponsorToEdit && !password.trim())) return;
        setIsLoading(true);
        try {
            const data: any = { name, email, role, isActive };
            if (!sponsorToEdit) {
                data.password = password;
            }
            await onSave(data);
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{sponsorToEdit ? 'Edit Sponsor' : 'New Sponsor'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" disabled={isLoading} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" disabled={isLoading} />
                    </div>
                    {!sponsorToEdit && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" disabled={isLoading} />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={role} onValueChange={setRole} disabled={isLoading}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Sponsor">Sponsor</SelectItem>
                                <SelectItem value="ProductOwner">Product Owner</SelectItem>
                                <SelectItem value="Approver">Approver</SelectItem>
                                <SelectItem value="User">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isActive" className="text-right">Status</Label>
                        <Select value={isActive ? 'true' : 'false'} onValueChange={(val) => setIsActive(val === 'true')} disabled={isLoading}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading || !name.trim() || !email.trim() || (!sponsorToEdit && !password.trim())}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
