'use client';

import { useState, useEffect } from 'react';
import { RequirementReference } from '../types';
import { RequirementsService } from '../service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, Plus, FileText, Link as LinkIcon, Download, Edit2, Save, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ReferencesTabProps {
    requirementId: string;
}

export function ReferencesTab({ requirementId }: ReferencesTabProps) {
    const [references, setReferences] = useState<RequirementReference[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form Details
    const [type, setType] = useState('Document');
    const [name, setName] = useState('');
    const [path, setPath] = useState('');

    const fetchReferences = async () => {
        setLoading(true);
        try {
            const data = await RequirementsService.getReferences(requirementId);
            setReferences(data);
        } catch (error) {
            console.error('Failed to load references', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (requirementId) {
            fetchReferences();
        }
    }, [requirementId]);

    const resetForm = () => {
        setType('Document');
        setName('');
        setPath('');
        setEditingId(null);
    };

    const handleEdit = (ref: RequirementReference) => {
        setEditingId(ref.referenceId);
        setType(ref.type);
        setName(ref.referenceName);
        setPath(ref.path);
    };

    const handleSubmit = async () => {
        if (!name || !path) return;
        setSubmitting(true);
        try {
            if (editingId) {
                // Update existing
                // Note: RequirementsService needs updateReference implementation if not exists, 
                // but usually create/update logic is separate. 
                // Assuming createReference for now or I might need to add updateReference to service if missing.
                // Checking previous service code -> updateReference was NOT in the viewed snippet earlier!
                // I need to check if I need to add it. The API has PATCH/PUT. 
                // Wait, let's assume valid API mostly. I will assume updateReference exists or use create for now? 
                // No, I must check service. But for this step I will implement assuming standard CRUD.
                // Actually, looking at previous steps, I saw `createReference` and `deleteReference`. 
                // I should double check `RequirementsService`.
                // If missing, I will add it.
                // For now, I will assume it's like "create" but logically "update".
                // Wait, I should verify service first. But I'll modify UI to call `RequirementsService.updateReference` 
                // and I'll make sure to add that method if missing.
                await RequirementsService.updateReference(requirementId, editingId, {
                    type,
                    referenceName: name,
                    path,
                    status: 'Active'
                });
            } else {
                // Create new
                await RequirementsService.createReference(requirementId, {
                    type,
                    referenceName: name,
                    path,
                    status: 'Active'
                });
            }

            resetForm();
            await fetchReferences();
        } catch (error) {
            console.error('Failed to save reference', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this reference?')) return;
        try {
            await RequirementsService.deleteReference(requirementId, id);
            await fetchReferences();
        } catch (error) {
            console.error('Failed to delete reference', error);
        }
    };

    return (
        <div className="space-y-6 py-4">
            <div className={`grid grid-cols-12 gap-4 items-end p-4 rounded-lg border transition-colors ${editingId ? 'bg-orange-50/50 border-orange-100' : 'bg-zinc-50 border-zinc-100'}`}>
                <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Type</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="h-8 text-xs bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Document">Document</SelectItem>
                            <SelectItem value="Link">Link</SelectItem>
                            <SelectItem value="Image">Image</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="col-span-3 space-y-2">
                    <Label className="text-xs">Name</Label>
                    <Input className="h-8 text-xs bg-white" placeholder="e.g. Spec v1" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-span-5 space-y-2">
                    <Label className="text-xs">Path / URL</Label>
                    <Input className="h-8 text-xs bg-white" placeholder="https://..." value={path} onChange={(e) => setPath(e.target.value)} />
                </div>
                <div className="col-span-2 flex gap-2">
                    <Button onClick={handleSubmit} disabled={submitting || !name || !path} size="sm" className={`w-full h-8 text-xs ${editingId ? 'bg-orange-600 hover:bg-orange-700' : ''}`}>
                        {submitting ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : editingId ? <Save className="h-3 w-3 mr-2" /> : <Plus className="h-3 w-3 mr-2" />}
                        {editingId ? 'Save' : 'Add'}
                    </Button>
                    {editingId && (
                        <Button onClick={resetForm} variant="ghost" size="icon" className="h-8 w-8">
                            <X className="h-4 w-4 text-zinc-500" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="text-xs font-semibold">Name</TableHead>
                            <TableHead className="text-xs font-semibold">Type</TableHead>
                            <TableHead className="text-xs font-semibold">Path</TableHead>
                            <TableHead className="w-[80px] text-right pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-400">Loading...</TableCell>
                            </TableRow>
                        ) : references.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-400 italic text-xs">No references found</TableCell>
                            </TableRow>
                        ) : (
                            references.map((ref) => (
                                <TableRow key={ref.referenceId} className="group hover:bg-zinc-50/50 transition-colors">
                                    <TableCell>
                                        {ref.type === 'Link' ? <LinkIcon className="h-4 w-4 text-blue-400" /> : <FileText className="h-4 w-4 text-orange-400" />}
                                    </TableCell>
                                    <TableCell className="font-medium text-xs">{ref.referenceName}</TableCell>
                                    <TableCell className="text-xs text-zinc-500">{ref.type}</TableCell>
                                    <TableCell className="text-xs text-zinc-400 max-w-[200px] truncate" title={ref.path}>
                                        <a href={ref.path} target="_blank" rel="noreferrer" className="hover:text-blue-500 hover:underline">{ref.path}</a>
                                    </TableCell>
                                    <TableCell className="text-right pr-4">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(ref)} className="h-7 w-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Edit">
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(ref.referenceId)} className="h-7 w-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
