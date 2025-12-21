'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface FieldDefinition {
    key: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'number' | 'checkbox';
}

interface CatalogCRUDProps<T, ID = number | string> {
    title: string;
    description: string;
    idField: keyof T;
    fields: FieldDefinition[];
    fetchData: () => Promise<T[]>;
    createItem: (data: any) => Promise<T>;
    updateItem: (id: ID, data: any) => Promise<T>;
    deleteItem: (id: ID) => Promise<void>;
    showId?: boolean;
}

export function CatalogCRUD<T extends { [key: string]: any }, ID = number | string>({
    title,
    description,
    idField,
    fields,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    showId = true
}: CatalogCRUDProps<T, ID>) {
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<T | null>(null);
    const [formData, setFormData] = useState<any>({});

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await fetchData();
            setItems(data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = () => {
        setItemToEdit(null);
        setFormData({});
        setIsDialogOpen(true);
    };

    const handleEdit = (item: T) => {
        setItemToEdit(item);
        const newFormData: any = {};
        fields.forEach(f => {
            newFormData[f.key] = item[f.key] || '';
        });
        setFormData(newFormData);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: ID) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteItem(id);
            toast.success('Item deleted successfully');
            loadData();
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (itemToEdit) {
                await updateItem(itemToEdit[idField as string], formData);
                toast.success('Item updated successfully');
            } else {
                await createItem(formData);
                toast.success('Item created successfully');
            }
            setIsDialogOpen(false);
            loadData();
        } catch (error) {
            console.error(error);
            toast.error('Operation failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" /> New Item
                </Button>
            </div>

            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {showId && <TableHead className="w-[80px]">ID</TableHead>}
                                {fields.map(field => (
                                    <TableHead key={field.key}>{field.label}</TableHead>
                                ))}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={fields.length + (showId ? 2 : 1)} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={fields.length + (showId ? 2 : 1)} className="h-24 text-center text-muted-foreground">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                Array.isArray(items) && items.map((item) => (
                                    <TableRow key={item[idField as string]} className="group hover:bg-muted/50 transition-colors">
                                        {showId && (
                                            <TableCell className="font-medium text-muted-foreground">
                                                #{item[idField as string]}
                                            </TableCell>
                                        )}
                                        {fields.map(field => (
                                            <TableCell key={field.key}>
                                                {item[field.key]}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(item)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(item[idField as string])}
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{itemToEdit ? 'Edit Item' : 'New Item'}</DialogTitle>
                        <DialogDescription>
                            {itemToEdit ? 'Make changes to the item here.' : 'Add a new item to the catalog.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="space-y-4 py-4">
                            {fields.map(field => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key}>{field.label}</Label>
                                    {field.type === 'checkbox' ? (
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id={field.key}
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={!!formData[field.key]}
                                                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                                            />
                                            <span className="text-sm text-muted-foreground">Enabled</span>
                                        </div>
                                    ) : (
                                        <Input
                                            id={field.key}
                                            type={field.type || 'text'}
                                            value={formData[field.key] || ''}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
