import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "./components/PageHeader";
import { TenantBrowser } from "./components/TenantBrowser";
import { TenantModals } from "./components/TenantModals";
import { useOpsTenantsPage } from "./hooks/useOpsTenantsPage";

export function OpsTenantsPage() {
  const h = useOpsTenantsPage();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Tenant Management"
        subtitle="Configure isolated database schemas and access points for business tenants."
        action={
          <Button
            onClick={h.handleOpenAdd}
            className="bg-amber-600 text-white hover:bg-amber-700 font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center gap-2"
          >
            <Plus className="h-4.5 w-4.5 stroke-[3]" />
            Provision Tenant
          </Button>
        }
      />

      <TenantBrowser
        search={h.search}
        setSearch={h.setSearch}
        isFetching={h.isFetching}
        isLoading={h.isLoading}
        tenants={h.tenants}
        onEdit={h.handleOpenEdit}
        onDelete={h.handleOpenDelete}
        page={h.page}
        totalPages={h.totalPages}
        totalElements={h.totalElements}
        onPrev={() => h.setPage((p) => Math.max(0, p - 1))}
        onNext={() => h.setPage((p) => Math.min(h.totalPages - 1, p + 1))}
      />
      <TenantModals
        isAddOpen={h.isAddOpen}
        isEditOpen={h.isEditOpen && Boolean(h.selectedTenant)}
        isDeleteOpen={h.isDeleteOpen && Boolean(h.selectedTenant)}
        selected={h.selectedTenant}
        name={h.name}
        setName={h.setName}
        url={h.url}
        setUrl={h.setUrl}
        onClose={h.closeForms}
        onSubmitAdd={h.handleAddSubmit}
        onSubmitEdit={h.handleEditSubmit}
        onConfirmDelete={h.handleDeleteConfirm}
        addPending={h.addMutation.isPending}
        editPending={h.updateMutation.isPending}
        deletePending={h.deleteMutation.isPending}
      />
    </div>
  );
}
