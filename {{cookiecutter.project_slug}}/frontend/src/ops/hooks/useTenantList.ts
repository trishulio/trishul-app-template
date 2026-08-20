import { useState } from "react";
import { useGetAll } from "@/lib/api/client";

const pageSize = 10;

export function useTenantList() {
  const [search, setSearchRaw] = useState("");
  const [page, setPage] = useState(0);

  const setSearch = (value: string) => {
    setSearchRaw(value);
    setPage(0);
  };

  const { data, isLoading, isFetching, refetch } = useGetAll({
    page,
    size: pageSize,
    names: search ? [search] : undefined,
    urls: search ? [search] : undefined,
  });

  return {
    search,
    setSearch,
    page,
    setPage,
    refetch,
    isLoading,
    isFetching,
    tenants: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    totalElements: data?.totalElements ?? 0,
  };
}
