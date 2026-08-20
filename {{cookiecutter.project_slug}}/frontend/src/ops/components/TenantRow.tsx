import { Building } from "lucide-react";
import type { TenantDto } from "@/lib/api/model/tenantDto";
import { TenantStatus } from "./TenantStatus";
import { TenantEndpoint } from "./TenantEndpoint";
import { TenantActions } from "./TenantActions";

const formatDate = (value?: string | null) =>
  value ? value.slice(0, 10) : "N/A";

export function TenantRow({
  tenant,
  onEdit,
  onDelete,
}: {
  tenant: TenantDto;
  onEdit: (t: TenantDto) => void;
  onDelete: (t: TenantDto) => void;
}) {
  return (
    <tr className="hover:bg-slate-50/[0.3] dark:hover:bg-slate-900/[0.2] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Building className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {tenant.name}
            </p>
            <p className="text-[11px] text-slate-400 font-mono select-all">
              {tenant.id}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <TenantEndpoint url={tenant.url} />
      </td>
      <td className="px-6 py-4">
        <TenantStatus ready={tenant.isReady} />
      </td>
      <td className="px-6 py-4">
        <div className="text-[11px] text-slate-400 space-y-0.5">
          <p>Created: {formatDate(tenant.createdAt)}</p>
          <p>Updated: {formatDate(tenant.lastUpdated)}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <TenantActions
          onEdit={() => onEdit(tenant)}
          onDelete={() => onDelete(tenant)}
        />
      </td>
    </tr>
  );
}
