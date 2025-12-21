'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CatalogsService } from '@/features/catalogs/service';
import { RequirementTypeDialog } from '@/features/catalogs/components/RequirementTypeDialog';
import { RequirementType } from '@/features/catalogs/types';
import { toast } from 'sonner';

export function RequirementTypesList() {
    const [types, setTypes] = useState<RequirementType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [typeToEdit, setTypeToEdit] = useState<RequirementType | null>(null);

    const loadTypes = async () => {
        setIsLoading(true);
        try {
            const data = await CatalogsService.getTypes();
            setTypes(data);
        } catch (error) {
            toast.error('Failed to load requirement types');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTypes();
    }, []);

    const handleCreate = () => {
        setTypeToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (type: RequirementType) => {
        setTypeToEdit(type);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this type?')) return;
        try {
            await CatalogsService.deleteType(id);
            toast.success('Type deleted successfully');
            loadTypes();
        } catch (error) {
            toast.error('Failed to delete type');
        }
    };

    const handleSave = async (name: string) => {
        try {
            if (typeToEdit) {
                await CatalogsService.updateType(typeToEdit.typeId, { name });
                toast.success('Type updated successfully');
            } else {
                await CatalogsService.createType({ name });
                toast.success('Type created successfully');
            }
            loadTypes();
        } catch (error) {
            console.error(error);
            throw error; // Dialog handles error logging
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Requirement Types</h2>
                    <p className="text-muted-foreground">Manage the types of requirements available in the system.</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> New Type
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : types.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No types found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                types.map((type) => (
                                    <TableRow key={type.typeId} className="group hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-muted-foreground">#{type.typeId}</TableCell>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(type)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(type.typeId)}
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

            <RequirementTypeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                typeToEdit={typeToEdit}
                onSave={handleSave}
            />
        </div>
    );
}
