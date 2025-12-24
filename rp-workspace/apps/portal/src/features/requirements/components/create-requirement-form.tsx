'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRequirementSchema, CreateRequirementFormData } from '../schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { VerificationMethod } from '@/features/catalogs/types';
import { Epic } from '@/features/epics/types';
import { Sponsor } from '@/features/sponsors/service';
import { toast } from 'sonner';

interface CreateRequirementFormProps {
    onSuccess: (data: CreateRequirementFormData) => Promise<void>;
    onCancel: () => void;
    methods: VerificationMethod[];
    priorities: any[];
    complexities: any[];
    riskLevels: any[];
    effortTypes: any[];
    metrics: any[];
    epics: Epic[];
    users: Sponsor[];
    productOwners: any[];
    approvers: any[];
    defaultEpicId?: string;
    creating: boolean;
}

export function CreateRequirementForm({
    onSuccess,
    onCancel,
    methods,
    priorities,
    complexities,
    riskLevels,
    effortTypes,
    metrics,
    epics,
    users,
    productOwners,
    approvers,
    defaultEpicId,
    creating
}: CreateRequirementFormProps) {
    const form = useForm<CreateRequirementFormData>({
        resolver: zodResolver(createRequirementSchema),
        defaultValues: {
            title: '',
            storyStatement: '',
            acceptanceCriteria: '',
            effortEstimate: undefined,
            actualEffort: undefined,
            businessValue: undefined,
            goLiveDate: '',
            requirementStatusDate: '',
            requirementVersion: '1.0',
            isMandatory: false,
            changeHistoryLink: '',
            ownerRole: '',
            applicablePhase: '',
            priorityId: undefined,
            complexityId: undefined,
            riskLevelId: undefined,
            sourceId: undefined,
            effortTypeId: undefined,
            metricId: undefined,
            verificationMethodId: undefined,
            epicId: defaultEpicId || '',
            productOwnerId: '',
            approverUserId: '',
        },
    });

    const handleSubmit = async (data: CreateRequirementFormData) => {
        try {
            const payload: any = {
                title: data.title,
                storyStatement: data.storyStatement || undefined,
                acceptanceCriteria: data.acceptanceCriteria || undefined,
                effortEstimate: data.effortEstimate,
                actualEffort: data.actualEffort,
                businessValue: data.businessValue,
                goLiveDate: data.goLiveDate || undefined,
                requirementStatusDate: data.requirementStatusDate || undefined,
                requirementVersion: data.requirementVersion || undefined,
                isMandatory: data.isMandatory,
                changeHistoryLink: data.changeHistoryLink || undefined,
                ownerRole: data.ownerRole || undefined,
                applicablePhase: data.applicablePhase || undefined,
                priorityId: data.priorityId,
                complexityId: data.complexityId,
                riskLevelId: data.riskLevelId,
                sourceId: data.sourceId,
                effortTypeId: data.effortTypeId,
                metricId: data.metricId,
                verificationMethodId: data.verificationMethodId,
                epicId: data.epicId || undefined,
                productOwnerId: data.productOwnerId || undefined,
                approverUserId: data.approverUserId || undefined,
            };

            await onSuccess(payload);
            form.reset();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al crear el requisito';
            toast.error(errorMessage);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
                    {/* Primary Info */}
                    <div className="col-span-2 space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. User Login Page" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <FormField
                            control={form.control}
                            name="storyStatement"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description / Story Statement</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="As a user..." className="h-20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <FormField
                            control={form.control}
                            name="acceptanceCriteria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acceptance Criteria</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Given... When... Then..." className="h-20" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Classification */}
                    <FormField
                        control={form.control}
                        name="priorityId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select
                                    value={field.value?.toString() || ''}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {priorities.map((p) => (
                                            <SelectItem key={p.priorityId} value={p.priorityId?.toString()}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="complexityId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Complexity</FormLabel>
                                <Select
                                    value={field.value?.toString() || ''}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Complexity" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {complexities.map((c) => (
                                            <SelectItem key={c.complexityId} value={c.complexityId?.toString()}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="riskLevelId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Risk Level</FormLabel>
                                <Select
                                    value={field.value?.toString() || ''}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Risk Level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {riskLevels.map((r) => (
                                            <SelectItem key={r.riskLevelId} value={r.riskLevelId?.toString()}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="effortTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Effort Type</FormLabel>
                                <Select
                                    value={field.value?.toString() || ''}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Effort Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {effortTypes.map((e) => (
                                            <SelectItem key={e.effortTypeId} value={e.effortTypeId?.toString()}>
                                                {e.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="metricId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Metric</FormLabel>
                                <Select
                                    value={field.value?.toString() || ''}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Metric" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {metrics.map((m) => (
                                            <SelectItem key={m.metricId} value={m.metricId?.toString()}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Governance */}
                    <FormField
                        control={form.control}
                        name="verificationMethodId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Method</FormLabel>
                                <Select
                                    value={field.value?.toString() || ''}
                                    onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {methods.map((m) => (
                                            <SelectItem key={m.verificationMethodId} value={m.verificationMethodId?.toString()}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Roles */}
                    <FormField
                        control={form.control}
                        name="productOwnerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Owner</FormLabel>
                                <Select
                                    value={field.value || ''}
                                    onValueChange={(value) => field.onChange(value || undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select PO" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {productOwners.map((po) => (
                                            <SelectItem key={po.productOwnerId} value={po.productOwnerId}>
                                                {po.firstName} {po.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="approverUserId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Approver</FormLabel>
                                <Select
                                    value={field.value || ''}
                                    onValueChange={(value) => field.onChange(value || undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Approver" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {approvers.map((app) => (
                                            <SelectItem key={app.approverId} value={app.approverId}>
                                                {app.firstName} {app.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Linkage */}
                    <FormField
                        control={form.control}
                        name="epicId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Epic</FormLabel>
                                <Select
                                    value={field.value || ''}
                                    onValueChange={(value) => field.onChange(value || undefined)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Epic" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {epics.map((e) => (
                                            <SelectItem key={e.epicId} value={e.epicId}>
                                                {e.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="requirementVersion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Version</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Metadata */}
                    <FormField
                        control={form.control}
                        name="effortEstimate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Effort (Points)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="actualEffort"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Actual Effort</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="businessValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Value</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="goLiveDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Go Live Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="requirementStatusDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="changeHistoryLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Change History Link</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="https://..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ownerRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Owner Role</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. Product Manager" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="applicablePhase"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Applicable Phase</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="e.g. Development" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isMandatory"
                        render={({ field }) => (
                            <FormItem className="col-span-2 flex items-center gap-2 pt-2">
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        id="mandatory"
                                        checked={field.value || false}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                </FormControl>
                                <FormLabel htmlFor="mandatory" className="!mt-0 cursor-pointer">
                                    Is Mandatory?
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={creating}>
                        {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </div>
            </form>
        </Form>
    );
}

