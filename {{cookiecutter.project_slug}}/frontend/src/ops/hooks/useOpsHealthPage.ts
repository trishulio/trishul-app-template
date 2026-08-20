import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/mutator";
import { toast } from "sonner";
import type { HealthData } from "../healthData";

export function useOpsHealthPage() {
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

  return {
    health,
    isLoading,
    isError,
    refetch,
    isFetching,
    copied,
    handleCopyJson,
  };
}
