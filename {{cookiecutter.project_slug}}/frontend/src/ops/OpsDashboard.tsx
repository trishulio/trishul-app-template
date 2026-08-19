import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useGetAll as useGetTenants } from "@/lib/api/client";
import { apiClient } from "@/lib/api/mutator";
import {
  Activity,
  Database,
  Cpu,
  Layers,
  ArrowRight,
  HardDrive,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface HealthResponse {
  status: string;
  components?: {
    db?: {
      status: string;
      details?: {
        database?: string;
        validationQuery?: string;
      };
    };
    diskSpace?: {
      status: string;
      details?: {
        total: number;
        free: number;
        threshold: number;
      };
    };
    ping?: {
      status: string;
    };
  };
}

export function OpsDashboard() {
  const [refreshedAt, setRefreshedAt] = useState("");

  useEffect(() => {
    const updateRefreshedAt = () => {
      setRefreshedAt(new Date().toLocaleTimeString());
    };

    updateRefreshedAt();
    const intervalId = window.setInterval(updateRefreshedAt, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  // Query actuator health
  const { data: health, isLoading: healthLoading } = useQuery<HealthResponse>({
    queryKey: ["opsActuatorHealth"],
    queryFn: () =>
      apiClient<HealthResponse>({ url: "/actuator/health", method: "GET" }),
    refetchInterval: 15000, // Refetch every 15s
  });

  // Query tenants count
  const { data: tenantsData, isLoading: tenantsLoading } = useGetTenants(
    { page: 0, size: 1 },
    { query: { refetchOnWindowFocus: true } },
  );

  const totalTenants =
    tenantsData?.totalElements ?? tenantsData?.content?.length ?? 0;
  const isHealthy = health?.status === "UP";

  // Format Disk size
  const diskDetails = health?.components?.diskSpace?.details;
  const totalDiskGb = diskDetails
    ? (diskDetails.total / (1024 * 1024 * 1024)).toFixed(1)
    : "0";
  const freeDiskGb = diskDetails
    ? (diskDetails.free / (1024 * 1024 * 1024)).toFixed(1)
    : "0";
  const usedDiskGb = diskDetails
    ? ((diskDetails.total - diskDetails.free) / (1024 * 1024 * 1024)).toFixed(1)
    : "0";
  const diskUsagePercentage = diskDetails
    ? Math.round(
        ((diskDetails.total - diskDetails.free) / diskDetails.total) * 100,
      )
    : 0;

  const dbStatus =
    health?.components?.db?.status || (healthLoading ? "LOADING" : "UNKNOWN");
  const dbType = health?.components?.db?.details?.database || "PostgreSQL";

  // System diagnostic cards
  const stats = [
    {
      name: "System Health Status",
      value: healthLoading ? "Checking..." : isHealthy ? "Healthy" : "Degraded",
      description: healthLoading
        ? "Contacting actuator..."
        : isHealthy
          ? "All services UP"
          : "Service disruption detected",
      icon: Activity,
      color: healthLoading
        ? "text-slate-400 bg-slate-100 dark:bg-slate-800"
        : isHealthy
          ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
          : "text-red-500 bg-red-50 dark:bg-red-950/20",
      iconColor: healthLoading
        ? "text-slate-500"
        : isHealthy
          ? "text-emerald-500"
          : "text-red-500",
    },
    {
      name: "Registered Tenants",
      value: tenantsLoading ? "..." : String(totalTenants),
      description: "Active isolated environments",
      icon: Database,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
      iconColor: "text-amber-500",
    },
    {
      name: "Database Connector",
      value: dbStatus,
      description: dbType,
      icon: Layers,
      color:
        dbStatus === "UP"
          ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
          : "text-rose-500 bg-rose-50 dark:bg-rose-950/20",
      iconColor: dbStatus === "UP" ? "text-emerald-500" : "text-rose-500",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            System Status Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5">
            Real-time status overview of {"{{cookiecutter.project_name}}"} backend, actuator probes,
            and multi-tenant nodes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          Refreshed: {refreshedAt}
        </div>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between shadow-sm"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.name}
                </p>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </h3>
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
        })}
      </div>

      {/* Detailed Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disk Space Diagnostics */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold flex items-center gap-2.5">
              <HardDrive className="h-5 w-5 text-amber-500" />
              Node Storage Diagnostics
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Disk Mount
            </span>
          </div>

          {healthLoading ? (
            <div className="h-24 flex items-center justify-center text-sm text-slate-500">
              Loading disk details...
            </div>
          ) : !diskDetails ? (
            <div className="h-24 flex items-center justify-center text-sm text-amber-500 gap-2">
              <AlertTriangle className="h-5 w-5" />
              Disk details unavailable on this environment.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-baseline text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Disk Space Used
                </span>
                <span className="text-slate-500">
                  <strong className="text-slate-900 dark:text-slate-100">
                    {usedDiskGb} GB
                  </strong>{" "}
                  / {totalDiskGb} GB ({diskUsagePercentage}%)
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    diskUsagePercentage > 85
                      ? "bg-rose-500"
                      : diskUsagePercentage > 60
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${diskUsagePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Free Space: {freeDiskGb} GB</span>
                <span>Threshold limit: 10.0 MB</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Shortcut Navigator */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-md font-bold flex items-center gap-2.5 mb-2">
            <Cpu className="h-5 w-5 text-amber-500" />
            Engineering Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/tenants"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/[0.03] transition-all group"
            >
              <div>
                <h4 className="text-sm font-semibold group-hover:text-amber-500 transition-colors">
                  Manage Tenants
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provision / Edit CRM nodes
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
            </Link>

            <Link
              to="/health"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/[0.03] transition-all group"
            >
              <div>
                <h4 className="text-sm font-semibold group-hover:text-amber-500 transition-colors">
                  Actuator Status
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect liveness & probes
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
            </Link>

            <Link
              to="/beans"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/[0.03] transition-all group"
            >
              <div>
                <h4 className="text-sm font-semibold group-hover:text-amber-500 transition-colors">
                  Beans Directory
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  View Spring application context
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
