import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "./components/PageHeader";
import { LoadingPanel } from "./components/LoadingPanel";
import { BeanExplorer } from "./components/BeanExplorer";
import { BeanErrorState } from "./components/BeanErrorState";
import { useOpsBeansPage } from "./hooks/useOpsBeansPage";

export function OpsBeansPage() {
  const { isLoading, isError, refetch, isFetching, explorer } =
    useOpsBeansPage();

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col overflow-hidden">
      <PageHeader
        title="Spring Beans Explorer"
        subtitle="Browse, search, and navigate dependencies in the Spring Application Context."
        action={
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="rounded-xl flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh Context
          </Button>
        }
      />

      {isLoading ? (
        <LoadingPanel label="Parsing Spring Application Context..." />
      ) : isError ? (
        <BeanErrorState />
      ) : (
        <BeanExplorer {...explorer} />
      )}
    </div>
  );
}
