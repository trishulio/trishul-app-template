import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "./components/PageHeader";
import { LoadingPanel } from "./components/LoadingPanel";
import { HealthStatusPanel } from "./components/HealthStatusPanel";
import { HealthProbes } from "./components/HealthProbes";
import { RawPayload } from "./components/RawPayload";
import { HealthErrorState } from "./components/HealthErrorState";
import { useOpsHealthPage } from "./hooks/useOpsHealthPage";

export function OpsHealthPage() {
  const h = useOpsHealthPage();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Actuator Health Checks"
        subtitle="Diagnostic dashboard displaying results from Spring Boot actuator health metrics."
        action={
          <Button
            variant="outline"
            onClick={() => h.refetch()}
            disabled={h.isLoading || h.isFetching}
            className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${h.isFetching ? "animate-spin" : ""}`}
            />
            Refresh Probes
          </Button>
        }
      />

      {h.isLoading ? (
        <LoadingPanel label="Running diagnostic queries..." />
      ) : h.isError || !h.health ? (
        <HealthErrorState />
      ) : (
        <div className="space-y-6">
          <HealthStatusPanel status={h.health.status} />
          {h.health.components && (
            <HealthProbes components={h.health.components} />
          )}
          <RawPayload
            payload={h.health}
            copied={h.copied}
            onCopy={h.handleCopyJson}
          />
        </div>
      )}
    </div>
  );
}
