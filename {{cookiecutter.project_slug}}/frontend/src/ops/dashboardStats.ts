import { Activity, Database, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  dbTone,
  healthDesc,
  healthTone,
  healthValue,
} from "./dashboardStatData";

export interface StatCardData {
  name: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export interface StatInputs {
  healthLoading: boolean;
  isHealthy: boolean;
  tenantsLoading: boolean;
  totalTenants: number;
  dbStatus: string;
  dbType: string;
}

export function buildStats(input: StatInputs): StatCardData[] {
  return [
    {
      name: "System Health Status",
      value: healthValue(input),
      description: healthDesc(input),
      icon: Activity,
      ...healthTone(input),
    },
    {
      name: "Registered Tenants",
      value: input.tenantsLoading ? "..." : String(input.totalTenants),
      description: "Active isolated environments",
      icon: Database,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
      iconColor: "text-amber-500",
    },
    {
      name: "Database Connector",
      value: input.dbStatus,
      description: input.dbType,
      icon: Layers,
      ...dbTone(input),
    },
  ];
}
