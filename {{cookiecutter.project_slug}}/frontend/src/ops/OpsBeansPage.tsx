import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/mutator";
import { Search, RefreshCw, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeanRow } from "./components/BeanRow";
import { BeanDetailsPanel } from "./components/BeanDetailsPanel";

interface ActuatorBean {
  aliases: string[];
  scope: string;
  type: string;
  resource: string | null;
  dependencies: string[];
}

interface ActuatorBeansContext {
  beans: Record<string, ActuatorBean>;
  parentId?: string | null;
}

interface ActuatorBeansResponse {
  contexts: Record<string, ActuatorBeansContext>;
}

interface BeanInfo extends ActuatorBean {
  name: string;
  context: string;
}

function BeanTypeRenderer({ type }: { type: string }) {
  if (!type)
    return <span className="text-slate-400 italic">No class type</span>;
  const parts = type.split(".");
  const className = parts.pop();
  const packagePath = parts.join(".");
  return (
    <span className="truncate block font-mono text-xs">
      <span className="text-slate-400 dark:text-slate-500">{packagePath}.</span>
      <strong className="text-slate-900 dark:text-slate-200 font-semibold">
        {className}
      </strong>
    </span>
  );
}

export function OpsBeansPage() {
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [selectedBean, setSelectedBean] = useState<BeanInfo | null>(null);

  // Fetch beans
  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<ActuatorBeansResponse>({
      queryKey: ["opsActuatorBeans"],
      queryFn: () =>
        apiClient<ActuatorBeansResponse>({
          url: "/actuator/beans",
          method: "GET",
        }),
    });

  // Flatten beans from contexts
  const beans: BeanInfo[] = useMemo(() => {
    if (!data?.contexts) return [];
    const list: BeanInfo[] = [];
    Object.entries(data.contexts).forEach(([ctxName, ctxData]) => {
      if (ctxData.beans) {
        Object.entries(ctxData.beans).forEach(([beanName, beanData]) => {
          list.push({
            name: beanName,
            context: ctxName,
            ...beanData,
          });
        });
      }
    });
    return list;
  }, [data]);

  // Unique scopes
  const scopes = useMemo(() => {
    const set = new Set<string>();
    beans.forEach((b) => {
      if (b.scope) set.add(b.scope);
    });
    return Array.from(set);
  }, [beans]);

  // Filter beans
  const filteredBeans = useMemo(() => {
    return beans.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.type.toLowerCase().includes(search.toLowerCase());
      const matchesScope = scopeFilter === "all" || b.scope === scopeFilter;
      return matchesSearch && matchesScope;
    });
  }, [beans, search, scopeFilter]);

  // Highlight Class vs Package
  const handleSelectBean = (bean: BeanInfo) => {
    setSelectedBean(bean);
  };

  const handleNavigateToDependency = (depName: string) => {
    setSearch(depName);
    setScopeFilter("all");
    const found = beans.find((b) => b.name === depName);
    if (found) {
      setSelectedBean(found);
    } else {
      setSelectedBean(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">
            Spring Beans Explorer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and navigate dependencies in the Spring Application
            Context.
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
          Refresh Context
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500">
          <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-sm font-semibold">
            Parsing Spring Application Context...
          </span>
        </div>
      ) : isError ? (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-5">
          <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-950/20 text-amber-500 flex-shrink-0">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              Beans Endpoint Disabled or Unreachable
            </h3>
            <p className="text-sm text-slate-500 max-w-lg">
              Could not retrieve Spring beans. Ensure `/actuator/beans` is
              enabled by setting `management.endpoints.web.exposure.include=*`
              in your application properties.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Main List Area */}
          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* Filter and Search Box */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {/* Search input */}
              <div className="flex-1 flex items-center gap-3 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 bg-slate-50 dark:bg-slate-950">
                <Search className="h-4.5 w-4.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search beans by name or type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-sm placeholder-slate-400 text-slate-900 dark:text-slate-100"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-slate-400 hover:text-slate-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Scope filter selector */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Scope:
                </span>
                <select
                  value={scopeFilter}
                  onChange={(e) => setScopeFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm rounded-xl px-3 py-2 outline-none text-slate-700 dark:text-slate-300 font-medium min-w-[120px]"
                >
                  <option value="all">All Scopes</option>
                  {scopes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="flex items-center justify-between text-xs px-2 text-slate-500 font-medium flex-shrink-0">
              <span>
                Found{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  {filteredBeans.length}
                </strong>{" "}
                beans of {beans.length} total
              </span>
              <span>Scope Filter active: {scopeFilter}</span>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredBeans.map((bean) => {
                  const isSelected = selectedBean?.name === bean.name;
                  return (
                    <BeanRow
                      key={bean.name}
                      bean={bean}
                      selected={isSelected}
                      onSelect={handleSelectBean}
                      TypeRenderer={BeanTypeRenderer}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Sidebar Panel */}
          <BeanDetailsPanel
            selectedBean={selectedBean}
            onClose={() => setSelectedBean(null)}
            onNavigateToDependency={handleNavigateToDependency}
          />
        </div>
      )}
    </div>
  );
}
