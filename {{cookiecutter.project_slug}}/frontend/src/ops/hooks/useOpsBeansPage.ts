import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/mutator";
import type { ActuatorBeansResponse, BeanInfo } from "../beanTypes";
import { collectScopes, filterBeans, flattenBeans } from "../beanData";

export function useOpsBeansPage() {
  const [search, setSearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [selectedBean, setSelectedBean] = useState<BeanInfo | null>(null);

  const { data, isLoading, isError, refetch, isFetching } =
    useQuery<ActuatorBeansResponse>({
      queryKey: ["opsActuatorBeans"],
      queryFn: () =>
        apiClient<ActuatorBeansResponse>({
          url: "/actuator/beans",
          method: "GET",
        }),
    });

  const beans = flattenBeans(data);
  const scopes = collectScopes(beans);
  const filteredBeans = filterBeans(beans, search, scopeFilter);

  const handleSelectBean = (bean: BeanInfo) => setSelectedBean(bean);

  const handleNavigateToDependency = (depName: string) => {
    setSearch(depName);
    setScopeFilter("all");
    setSelectedBean(beans.find((b) => b.name === depName) ?? null);
  };

  return {
    isLoading,
    isError,
    isFetching,
    refetch,
    explorer: {
      search,
      setSearch,
      scopes,
      scopeFilter,
      setScopeFilter,
      filteredBeans,
      total: beans.length,
      selectedBean,
      setSelectedBean,
      onSelect: handleSelectBean,
      onNavigateToDependency: handleNavigateToDependency,
    },
  };
}
