import { ComponentProbeCard } from "./ComponentProbeCard";
import type { ComponentHealth } from "../healthData";

export function HealthProbes({
  components,
}: {
  components: Record<string, ComponentHealth>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
        Component Health Probes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(components).map(([name, data]) => (
          <ComponentProbeCard key={name} name={name} data={data} />
        ))}
      </div>
    </div>
  );
}
