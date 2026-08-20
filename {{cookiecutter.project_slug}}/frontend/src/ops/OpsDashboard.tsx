import { PageHeader } from "./components/PageHeader";
import { DashboardClock } from "./components/DashboardClock";
import { DashboardKpiCard } from "./components/DashboardKpiCard";
import { DiskDiagnostics } from "./components/DiskDiagnostics";
import { QuickActions } from "./components/QuickActions";
import { useOpsDashboard } from "./hooks/useOpsDashboard";
import { buildStats } from "./dashboardStats";

export function OpsDashboard() {
  const hook = useOpsDashboard();
  const stats = buildStats(hook);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title="System Status Dashboard"
          subtitle={`Real-time status overview of {{cookiecutter.project_name}} backend, actuator probes, and multi-tenant nodes.`}
        />
        <DashboardClock />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <DashboardKpiCard key={stat.name} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiskDiagnostics
          loading={hook.healthLoading}
          available={hook.diskAvailable}
          usedGb={hook.usedDiskGb}
          totalGb={hook.totalDiskGb}
          freeGb={hook.freeDiskGb}
          percentage={hook.diskUsagePercentage}
        />
        <QuickActions />
      </div>
    </div>
  );
}
