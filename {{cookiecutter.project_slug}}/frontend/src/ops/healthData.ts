import type { LucideIcon } from "lucide-react";
import { Activity, Database, HardDrive, HelpCircle } from "lucide-react";

export interface ComponentHealth {
  status: string;
  details?: Record<string, unknown>;
}

export interface DiskDetails {
  total: number;
  free: number;
  threshold: number;
}

export interface HealthData {
  status: string;
  components?: Record<string, ComponentHealth>;
}

export const GB = 1024 * 1024 * 1024;

export function getStatusColor(status?: string): string {
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
}

export function getComponentIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("db") || n.includes("datasource") || n.includes("database")) {
    return Database;
  }
  if (n.includes("disk") || n.includes("space") || n.includes("storage")) {
    return HardDrive;
  }
  if (n.includes("ping") || n.includes("liveness") || n.includes("readiness")) {
    return Activity;
  }
  return HelpCircle;
}
