'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';
import { SponsorsService, Sponsor } from '@/features/sponsors/service';
import { SponsorDialog } from '@/features/sponsors/components/SponsorDialog';
import { toast } from 'sonner';

export function SponsorsList() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [sponsorToEdit, setSponsorToEdit] = useState<Sponsor | null>(null);

    const loadSponsors = async () => {
        setIsLoading(true);
        try {
            const data = await SponsorsService.getAll();
            setSponsors(data);
        } catch (error) {
            toast.error('Failed to load sponsors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSponsors();
    }, []);

    const handleCreate = () => {
        setSponsorToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (sponsor: Sponsor) => {
        setSponsorToEdit(sponsor);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sponsor?')) return;
        try {
            await SponsorsService.delete(id);
            toast.success('Sponsor deleted successfully');
            loadSponsors();
        } catch (error) {
            toast.error('Failed to delete sponsor');
        }
    };

    const handleSave = async (data: Partial<Sponsor> & { password?: string }) => {
        try {
            if (sponsorToEdit) {
                await SponsorsService.update(sponsorToEdit.sponsorId, data);
                toast.success('Sponsor updated successfully');
            } else {
                await SponsorsService.create(data);
                toast.success('Sponsor created successfully');
            }
            loadSponsors();
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sponsors</h2>
                    <p className="text-muted-foreground">Manage system sponsors and users.</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> New Sponsor
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-center">Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : sponsors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No sponsors found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sponsors.map((sponsor) => (
                                    <TableRow key={sponsor.sponsorId} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium">{sponsor.name}</TableCell>
                                        <TableCell>{sponsor.email}</TableCell>
                                        <TableCell>{sponsor.role}</TableCell>
                                        <TableCell className="text-center">
                                            {sponsor.isActive ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-red-500" />}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(sponsor)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(sponsor.sponsorId)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <SponsorDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                sponsorToEdit={sponsorToEdit}
                onSave={handleSave}
            />
        </div>
    );
}
