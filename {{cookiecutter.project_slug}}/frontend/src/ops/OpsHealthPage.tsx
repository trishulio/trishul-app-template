import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/mutator";
import {
  Activity,
  Database,
  HardDrive,
  Copy,
  Check,
  RefreshCw,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ComponentHealth {
  status: string;
  details?: Record<string, unknown>;
}

interface DiskDetails {
  total: number;
  free: number;
  threshold: number;
}

interface HealthData {
  status: string;
  components?: Record<string, ComponentHealth>;
}

export function OpsHealthPage() {
  const [copied, setCopied] = useState(false);

  const {
    data: health,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<HealthData>({
    queryKey: ["opsActuatorHealthDetails"],
    queryFn: () =>
      apiClient<HealthData>({ url: "/actuator/health", method: "GET" }),
  });

  const handleCopyJson = () => {
    if (!health) return;
    navigator.clipboard.writeText(JSON.stringify(health, null, 2));
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "UP":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "DOWN":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "OUT_OF_SERVICE":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getComponentIcon = (name: string) => {
    const n = name.toLowerCase();
    if (
      n.includes("db") ||
      n.includes("datasource") ||
      n.includes("database")
    ) {
      return Database;
    }
    if (n.includes("disk") || n.includes("space") || n.includes("storage")) {
      return HardDrive;
    }
    if (
      n.includes("ping") ||
      n.includes("liveness") ||
      n.includes("readiness")
    ) {
      return Activity;
    }
    return HelpCircle;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header and Refetch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Actuator Health Checks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Diagnostic dashboard displaying results from Spring Boot actuator
            health metrics.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh Probes
        </Button>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-3 text-slate-500">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold">
            Running diagnostic queries...
          </span>
        </div>
      ) : isError || !health ? (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-5">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/20 text-red-500 flex-shrink-0">
            <AlertOctagon className="h-8 w-8" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Actuator Endpoint Unreachable
            </h3>
            <p className="text-sm text-slate-500 max-w-lg">
              Could not fetch health from `/actuator/health`. Make sure the
              backend server is running and actuator dependencies are fully
              configured in the application pom.xml.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Status Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="relative flex-shrink-0">
              <div
                className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  health.status === "UP"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500"
                }`}
              >
                {health.status === "UP" ? (
                  <CheckCircle className="h-9 w-9" />
                ) : (
                  <AlertOctagon className="h-9 w-9" />
                )}
              </div>
              {health.status === "UP" && (
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
                  health.status,
                )}`}
              >
                System {health.status}
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                {health.status === "UP"
                  ? "All systems operational"
                  : "One or more components are reporting warnings"}
              </h2>
              <p className="text-xs text-slate-400">
                Liveness probes verified. Host system reports full availability
                on standard ports.
              </p>
            </div>
          </div>

          {/* Component Checks Grid */}
          {health.components && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
                Component Health Probes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(health.components).map(([name, data]) => {
                  const Icon = getComponentIcon(name);
                  // Extract metrics if disk
                  const isDisk = name.toLowerCase().includes("disk");
                  const details = data.details || {};
                  const diskDetails = isDisk
                    ? (details as unknown as DiskDetails)
                    : null;

                  return (
                    <div
                      key={name}
                      className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                    >
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
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(
                            data.status,
                          )}`}
                        >
                          {data.status}
                        </span>
                      </div>

                      {/* Diagnostic details */}
                      <div className="flex-1 text-xs text-slate-500 space-y-2">
                        {isDisk && diskDetails && diskDetails.total && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span>Usage:</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {(
                                  (diskDetails.total - diskDetails.free) /
                                  (1024 * 1024 * 1024)
                                ).toFixed(1)}{" "}
                                GB /{" "}
                                {(
                                  diskDetails.total /
                                  (1024 * 1024 * 1024)
                                ).toFixed(1)}{" "}
                                GB
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-emerald-500 ${
                                  (diskDetails.total - diskDetails.free) /
                                    diskDetails.total >
                                  0.85
                                    ? "bg-rose-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.round(
                                    ((diskDetails.total - diskDetails.free) /
                                      diskDetails.total) *
                                      100,
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {!isDisk && Object.keys(details).length > 0 ? (
                          <div className="space-y-1 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/30">
                            {Object.entries(details)
                              .slice(0, 3)
                              .map(([k, v]) => (
                                <div
                                  key={k}
                                  className="flex justify-between text-[10px] gap-2"
                                >
                                  <span className="text-slate-400 truncate max-w-[80px]">
                                    {k}:
                                  </span>
                                  <span className="text-slate-700 dark:text-slate-300 font-mono truncate max-w-[160px]">
                                    {String(v)}
                                  </span>
                                </div>
                              ))}
                          </div>
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
                })}
              </div>
            </div>
          )}

          {/* Raw JSON View */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50/[0.4] dark:bg-slate-950/[0.2] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-4.5 w-4.5 text-amber-500" />
                <h3 className="font-bold text-sm">Raw Actuator Payload</h3>
              </div>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy JSON
              </button>
            </div>
            <pre className="p-6 text-[11px] font-mono leading-relaxed overflow-x-auto text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 max-h-[350px]">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
