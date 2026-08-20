import { useQuery } from "@tanstack/react-query";
import { useGetAll as useGetTenants } from "@/lib/api/client";
import { apiClient } from "@/lib/api/mutator";
import type { HealthResponse } from "../dashboardTypes";

const GB = 1024 * 1024 * 1024;
const toGb = (bytes?: number) =>
  bytes === undefined ? "0" : (bytes / GB).toFixed(1);

export function useOpsDashboard() {
  const { data: health, isLoading: healthLoading } = useQuery<HealthResponse>({
    queryKey: ["opsActuatorHealth"],
    queryFn: () =>
      apiClient<HealthResponse>({ url: "/actuator/health", method: "GET" }),
    refetchInterval: 15000,
  });

  const { data: tenantsData, isLoading: tenantsLoading } = useGetTenants(
    { page: 0, size: 1 },
    { query: { refetchOnWindowFocus: true } },
  );

  const totalTenants =
    tenantsData?.totalElements ?? tenantsData?.content?.length ?? 0;
  const isHealthy = health?.status === "UP";
  const disk = health?.components?.diskSpace?.details;
  const dbStatus =
    health?.components?.db?.status || (healthLoading ? "LOADING" : "UNKNOWN");

  return {
    healthLoading,
    tenantsLoading,
    isHealthy,
    totalTenants,
    totalDiskGb: toGb(disk?.total),
    freeDiskGb: toGb(disk?.free),
    usedDiskGb: toGb(disk ? disk.total - disk.free : undefined),
    diskUsagePercentage: disk
      ? Math.round(((disk.total - disk.free) / disk.total) * 100)
      : 0,
    dbStatus,
    dbType: health?.components?.db?.details?.database || "PostgreSQL",
    diskAvailable: Boolean(disk),
  };
}
