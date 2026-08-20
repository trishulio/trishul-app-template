import { getComponentIcon, getStatusColor } from "../healthData";
import { DiskUsage } from "./DiskUsage";
import { DetailRows } from "./DetailRows";
import type { ComponentHealth } from "../healthData";

export function ComponentProbeCard({
  name,
  data,
}: {
  name: string;
  data: ComponentHealth;
}) {
  const Icon = getComponentIcon(name);
  const isDisk = name.toLowerCase().includes("disk");
  const details = data.details || {};
  const diskDetails = isDisk
    ? (details as unknown as { total: number; free: number })
    : null;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/40">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
            {name}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(data.status)}`}
        >
          {data.status}
        </span>
      </div>

      <div className="flex-1 text-xs text-slate-500 space-y-2">
        {isDisk && diskDetails?.total ? (
          <DiskUsage total={diskDetails.total} free={diskDetails.free} />
        ) : !isDisk && Object.keys(details).length > 0 ? (
          <DetailRows details={details} />
        ) : (
          !isDisk && (
            <p className="text-slate-400 italic">
              No details returned by backend probe.
            </p>
          )
        )}
      </div>
    </div>
  );
}
