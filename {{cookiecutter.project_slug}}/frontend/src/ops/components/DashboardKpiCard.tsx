import type { StatCardData } from "../dashboardStats";

export function DashboardKpiCard({ stat }: { stat: StatCardData }) {
  const Icon = stat.icon;
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between shadow-sm">
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {stat.name}
        </p>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {stat.description}
          </p>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${stat.color} flex-shrink-0`}>
        <Icon className={`h-6 w-6 ${stat.iconColor}`} />
      </div>
    </div>
  );
}
