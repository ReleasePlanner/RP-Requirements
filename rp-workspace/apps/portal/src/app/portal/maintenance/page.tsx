'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SponsorsList } from "@/features/sponsors/components/SponsorsList";
import { CatalogCRUD } from "@/features/catalogs/components/CatalogCRUD";
import { CatalogsService } from "@/features/catalogs/service";
import { Priority, LifecycleStatus, RiskLevel, Complexity, Metric, VerificationMethod, RequirementType, ProductOwner, Approver } from "@/features/catalogs/types";
import { WidgetsService } from "@/features/dashboard/service";
import { Widget } from "@/features/dashboard/types";

export default function MaintenancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
                <p className="text-muted-foreground">
                    Manage system catalogs, sponsors, and requirement types.
                </p>
            </div>

            <Tabs defaultValue="catalogs" className="space-y-8">
                <TabsList>
                    <TabsTrigger value="catalogs">System Catalogs</TabsTrigger>
                    <TabsTrigger value="product-owners">Product Owners</TabsTrigger>
                    <TabsTrigger value="approvers">Approvers</TabsTrigger>
                    <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                    <TabsTrigger value="widgets">Widgets</TabsTrigger>
                </TabsList>

                <TabsContent value="catalogs" className="space-y-6">
                    <Tabs defaultValue="status" orientation="vertical" className="flex flex-col md:flex-row gap-6">
                        <TabsList className="flex flex-row md:flex-col md:w-64 md:h-auto justify-start border bg-transparent p-2 space-y-0 md:space-y-1">
                            <TabsTrigger value="status" className="w-full justify-start px-3">Lifecycle Status</TabsTrigger>
                            <TabsTrigger value="metric" className="w-full justify-start px-3">Metrics</TabsTrigger>
                            <TabsTrigger value="priority" className="w-full justify-start px-3">Priorities</TabsTrigger>
                            <TabsTrigger value="complexity" className="w-full justify-start px-3">Complexities</TabsTrigger>
                            <TabsTrigger value="risk" className="w-full justify-start px-3">Risk Levels</TabsTrigger>
                            <TabsTrigger value="method" className="w-full justify-start px-3">Verification Methods</TabsTrigger>
                            <TabsTrigger value="req-type" className="w-full justify-start px-3">Requirement Types</TabsTrigger>
                        </TabsList>

                        <div className="flex-1">
                            <TabsContent value="status" className="mt-0">
                                <CatalogCRUD<LifecycleStatus, number>
                                    title="Lifecycle Status"
                                    description="Manage lifecycle statuses for requirements."
                                    idField="statusId"
                                    fields={[{ key: 'name', label: 'Name', required: true }]}
                                    fetchData={CatalogsService.getStatuses}
                                    createItem={CatalogsService.createStatus}
                                    updateItem={CatalogsService.updateStatus}
                                    deleteItem={CatalogsService.deleteStatus}
                                />
                            </TabsContent>
                            <TabsContent value="metric" className="mt-0">
                                <CatalogCRUD<Metric, number>
                                    title="Metrics"
                                    description="Manage business goal metrics."
                                    idField="metricId"
                                    fields={[
                                        { key: 'name', label: 'Name', required: true },
                                        { key: 'baselineValue', label: 'Baseline Value' },
                                        { key: 'targetGoal', label: 'Target Goal' }
                                    ]}
                                    fetchData={CatalogsService.getMetrics}
                                    createItem={CatalogsService.createMetric}
                                    updateItem={CatalogsService.updateMetric}
                                    deleteItem={CatalogsService.deleteMetric}
                                />
                            </TabsContent>
                            <TabsContent value="priority" className="mt-0">
                                <CatalogCRUD<Priority, number>
                                    title="Priorities"
                                    description="Manage requirement priorities."
                                    idField="priorityId"
                                    fields={[{ key: 'name', label: 'Name', required: true }]}
                                    fetchData={CatalogsService.getPriorities}
                                    createItem={CatalogsService.createPriority}
                                    updateItem={CatalogsService.updatePriority}
                                    deleteItem={CatalogsService.deletePriority}
                                />
                            </TabsContent>
                            <TabsContent value="complexity" className="mt-0">
                                <CatalogCRUD<Complexity, number>
                                    title="Complexities"
                                    description="Manage technical complexity levels."
                                    idField="complexityId"
                                    fields={[{ key: 'name', label: 'Name', required: true }]}
                                    fetchData={CatalogsService.getComplexities}
                                    createItem={CatalogsService.createComplexity}
                                    updateItem={CatalogsService.updateComplexity}
                                    deleteItem={CatalogsService.deleteComplexity}
                                />
                            </TabsContent>
                            <TabsContent value="risk" className="mt-0">
                                <CatalogCRUD<RiskLevel, number>
                                    title="Risk Levels"
                                    description="Manage risk levels."
                                    idField="riskLevelId"
                                    fields={[{ key: 'name', label: 'Name', required: true }]}
                                    fetchData={CatalogsService.getRiskLevels}
                                    createItem={CatalogsService.createRiskLevel}
                                    updateItem={CatalogsService.updateRiskLevel}
                                    deleteItem={CatalogsService.deleteRiskLevel}
                                />
                            </TabsContent>
                            <TabsContent value="method" className="mt-0">
                                <CatalogCRUD<VerificationMethod, number>
                                    title="Verification Methods"
                                    description="Manage methods used to verify requirements."
                                    idField="verificationMethodId"
                                    fields={[{ key: 'name', label: 'Name', required: true }]}
                                    fetchData={CatalogsService.getVerificationMethods}
                                    createItem={CatalogsService.createVerificationMethod}
                                    updateItem={CatalogsService.updateVerificationMethod}
                                    deleteItem={CatalogsService.deleteVerificationMethod}
                                />
                            </TabsContent>
                            <TabsContent value="req-type" className="mt-0">
                                <CatalogCRUD<RequirementType, number>
                                    title="Requirement Types"
                                    description="Manage types of requirements."
                                    idField="typeId"
                                    fields={[{ key: 'name', label: 'Name', required: true }]}
                                    fetchData={CatalogsService.getTypes}
                                    createItem={CatalogsService.createType}
                                    updateItem={CatalogsService.updateType}
                                    deleteItem={CatalogsService.deleteType}
                                />
                            </TabsContent>
                        </div>
                    </Tabs>
                </TabsContent>

                <TabsContent value="product-owners" className="space-y-4">
                    <CatalogCRUD<ProductOwner, string>
                        title="Product Owners"
                        description="Manage product owners."
                        idField="productOwnerId"
                        fields={[
                            { key: 'firstName', label: 'First Name', required: true },
                            { key: 'lastName', label: 'Last Name', required: true },
                            { key: 'role', label: 'Role', required: true },
                            { key: 'status', label: 'Status' }
                        ]}
                        fetchData={CatalogsService.getProductOwners}
                        createItem={CatalogsService.createProductOwner}
                        updateItem={CatalogsService.updateProductOwner}
                        deleteItem={CatalogsService.deleteProductOwner}
                        showId={false}
                    />
                </TabsContent>

                <TabsContent value="approvers" className="space-y-4">
                    <CatalogCRUD<Approver, string>
                        title="Approvers"
                        description="Manage requirement approvers."
                        idField="approverId"
                        fields={[
                            { key: 'firstName', label: 'First Name', required: true },
                            { key: 'lastName', label: 'Last Name', required: true },
                            { key: 'role', label: 'Role', required: true },
                            { key: 'status', label: 'Status' }
                        ]}
                        fetchData={CatalogsService.getApprovers}
                        createItem={CatalogsService.createApprover}
                        updateItem={CatalogsService.updateApprover}
                        deleteItem={CatalogsService.deleteApprover}
                        showId={false}
                    />
                </TabsContent>

                <TabsContent value="sponsors" className="space-y-4">
                    <SponsorsList />
                </TabsContent>

                <TabsContent value="widgets" className="space-y-4">
                    <CatalogCRUD<Widget, string>
                        title="Dashboard Widgets"
                        description="Manage dashboard widgets visibility and global configuration."
                        idField="widgetId"
                        fields={[
                            { key: 'title', label: 'Title', required: true },
                            { key: 'type', label: 'Type', required: true },
                            { key: 'defaultOrder', label: 'Order', required: true, type: 'number' },
                            { key: 'isVisible', label: 'Visible', type: 'checkbox' }
                        ]}
                        fetchData={WidgetsService.getAll}
                        createItem={(data) => WidgetsService.create(data)}
                        updateItem={(id, data) => WidgetsService.update(id as string, data)}
                        deleteItem={(id) => WidgetsService.delete(id as string)}
                        showId={false}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

