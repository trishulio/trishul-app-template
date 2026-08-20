import type { TenantDto } from "@/lib/api/model/tenantDto";
import { TenantSearchBar } from "./TenantSearchBar";
import { TenantLoadingState } from "./TenantLoadingState";
import { TenantEmptyState } from "./TenantEmptyState";
import { TenantTable } from "./TenantTable";
import { TenantPagination } from "./TenantPagination";

interface TenantBrowserProps {
  search: string;
  setSearch: (value: string) => void;
  isFetching: boolean;
  isLoading: boolean;
  tenants: TenantDto[];
  onEdit: (t: TenantDto) => void;
  onDelete: (t: TenantDto) => void;
  page: number;
  totalPages: number;
  totalElements: number;
  onPrev: () => void;
  onNext: () => void;
}

export function TenantBrowser(props: TenantBrowserProps) {
  const table = props.isLoading ? (
    <TenantLoadingState />
  ) : props.tenants.length === 0 ? (
    <TenantEmptyState search={props.search} />
  ) : (
    <TenantTable
      tenants={props.tenants}
      onEdit={props.onEdit}
      onDelete={props.onDelete}
    />
  );

  return (
    <>
      <TenantSearchBar
        search={props.search}
        setSearch={props.setSearch}
        isFetching={props.isFetching}
      />
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {table}
        {!props.isLoading && props.totalPages > 1 && (
          <TenantPagination
            page={props.page}
            totalPages={props.totalPages}
            totalElements={props.totalElements}
            onPrev={props.onPrev}
            onNext={props.onNext}
          />
        )}
      </div>
    </>
  );
}
