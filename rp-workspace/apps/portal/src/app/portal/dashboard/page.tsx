import { DashboardContent } from "@/features/dashboard/components/dashboard-content";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to the Release Planner Portal. Here is an overview of your workspace.
                </p>
            </div>

            <DashboardContent />
        </div>
    );
}
