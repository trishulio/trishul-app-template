import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  Database,
  Building,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useOpsTenantsPage } from "./hooks/useOpsTenantsPage";
import { TenantDeleteModal } from "./components/TenantDeleteModal";
import { TenantFormModal } from "./components/TenantFormModal";
const formatTenantDate = (value?: string | null) =>
  value ? value.slice(0, 10) : "N/A";

export function OpsTenantsPage() {
  const {
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalElements,
    tenants,
    isLoading,
    isFetching,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    name,
    setName,
    url,
    setUrl,
    selectedTenant,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDelete,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    addMutation,
    updateMutation,
    deleteMutation,
  } = useOpsTenantsPage();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Tenant Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure isolated database schemas and access points for business
            tenants.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-amber-600 text-white hover:bg-amber-700 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center gap-2"
        >
          <Plus className="h-4.5 w-4.5 stroke-[3]" />
          Provision Tenant
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Filter tenants by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="bg-transparent border-0 outline-none w-full text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        {isFetching && (
          <Loader2 className="h-4 w-4 animate-spin text-amber-500 flex-shrink-0" />
        )}
      </div>

      {/* Tenants Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <span className="text-sm font-medium">
              Fetching tenant records...
            </span>
          </div>
        ) : tenants.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Database className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">
                No tenants found
              </h3>
              <p className="text-sm text-slate-500 max-w-sm">
                {search
                  ? `No results match "${search}". Try checking the name.`
                  : "Get started by provisioning your first database tenant."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/[0.4] dark:bg-slate-950/[0.2] text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Tenant Info</th>
                  <th className="px-6 py-4">Connection Endpoint</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamps</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="hover:bg-slate-50/[0.3] dark:hover:bg-slate-900/[0.2] transition-colors"
                  >
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
                      <a
                        href={tenant.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-amber-500 hover:underline font-medium text-xs break-all"
                      >
                        {tenant.url}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {tenant.isReady ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock className="h-3.5 w-3.5 animate-pulse" />
                          Provisioning
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <p>Created: {formatTenantDate(tenant.createdAt)}</p>
                        <p>Updated: {formatTenantDate(tenant.lastUpdated)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(tenant)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                          title="Edit Tenant"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(tenant)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                          title="Delete Tenant"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Info */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/[0.2] dark:bg-slate-950/[0.1] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing page {page + 1} of {totalPages} ({totalElements} total
              records)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <TenantFormModal
        isOpen={isAddOpen}
        title="Provision New Tenant"
        nameLabelId="tenant-name"
        urlLabelId="tenant-url"
        name={name}
        setName={setName}
        url={url}
        setUrl={setUrl}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddSubmit}
        isSubmitting={addMutation.isPending}
        submitLabel="Save & Init"
        submitButtonClassName="flex-1 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold"
      />

      <TenantFormModal
        isOpen={isEditOpen && Boolean(selectedTenant)}
        title="Modify Tenant Details"
        nameLabelId="tenant-edit-name"
        urlLabelId="tenant-edit-url"
        name={name}
        setName={setName}
        url={url}
        setUrl={setUrl}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save Changes"
        submitButtonClassName="flex-1 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold"
      />

      <TenantDeleteModal
        isOpen={isDeleteOpen && Boolean(selectedTenant)}
        tenantName={selectedTenant?.name || ""}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={deleteMutation.isPending}
      />
    </div>
  );
}
