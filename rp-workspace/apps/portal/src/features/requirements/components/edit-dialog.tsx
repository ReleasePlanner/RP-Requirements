'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Requirement } from '../types';
import { useState, useEffect } from 'react';
import { updateRequirementAction } from '../actions';
import { Loader2, Save } from 'lucide-react';
import { CatalogsService } from '../../catalogs/service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferencesTab } from './references-tab';
// import { ProductOwner, Approver } from '../../catalogs/types'; // Assuming types are exported there or we use 'any' for now if not easy to import

interface EditRequirementDialogProps {
    requirement: Requirement;
    trigger?: React.ReactNode;
}

export function EditRequirementDialog({ requirement, trigger }: EditRequirementDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState(requirement.title);
    const [storyStatement, setStoryStatement] = useState(requirement.storyStatement || '');
    const [effortEstimate, setEffortEstimate] = useState(requirement.effortEstimate?.toString() || '');
    const [acceptanceCriteria, setAcceptanceCriteria] = useState(requirement.acceptanceCriteria || '');
    const [productOwnerId, setProductOwnerId] = useState(requirement.productOwnerId || '');
    const [approverId, setApproverId] = useState(requirement.approverId || '');

    // Catalog Data
    const [productOwners, setProductOwners] = useState<any[]>([]);
    const [approvers, setApprovers] = useState<any[]>([]);

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const pos = await CatalogsService.getProductOwners();
                    const apps = await CatalogsService.getApprovers();
                    setProductOwners(pos);
                    setApprovers(apps);
                } catch (err) {
                    console.error('Failed to load catalogs', err);
                }
            };
            fetchData();
        }
    }, [open]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateRequirementAction(requirement.requirementId, {
                title,
                storyStatement,
                acceptanceCriteria,
                effortEstimate: effortEstimate ? parseFloat(effortEstimate) : undefined,
                productOwnerId: productOwnerId || undefined,
                approverId: approverId || undefined,
            });
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Edit</Button>}
            </DialogTrigger>

            <DialogContent className="max-w-[800px] bg-white" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Edit Requirement</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="references">References</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details">
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Product Owner</Label>
                                    <Select value={productOwnerId} onValueChange={setProductOwnerId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Product Owner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productOwners.map((po) => (
                                                <SelectItem key={po.productOwnerId} value={po.productOwnerId}>
                                                    {po.firstName} {po.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Approver</Label>
                                    <Select value={approverId} onValueChange={setApproverId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Approver" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {approvers.map((app) => (
                                                <SelectItem key={app.approverId} value={app.approverId}>
                                                    {app.firstName} {app.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Story Statement</Label>
                                <Textarea value={storyStatement} onChange={(e) => setStoryStatement(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Acceptance Criteria</Label>
                                <Textarea value={acceptanceCriteria} onChange={(e) => setAcceptanceCriteria(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Effort (Points)</Label>
                                <Input type="number" value={effortEstimate} onChange={(e) => setEffortEstimate(e.target.value)} />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="references">
                        <ReferencesTab requirementId={requirement.requirementId} />
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">Publish</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
