import type { FormEvent } from "react";
import { TenantFormModals } from "./TenantFormModals";
import { TenantDeleteModal } from "./TenantDeleteModal";

interface TenantModalsProps {
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  selected: { name?: string } | null;
  name: string;
  setName: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  onClose: () => void;
  onSubmitAdd: (event: FormEvent) => void;
  onSubmitEdit: (event: FormEvent) => void;
  onConfirmDelete: () => void;
  addPending: boolean;
  editPending: boolean;
  deletePending: boolean;
}

export function TenantModals(p: TenantModalsProps) {
  return (
    <>
      <TenantFormModals
        addOpen={p.isAddOpen}
        editOpen={p.isEditOpen}
        name={p.name}
        setName={p.setName}
        url={p.url}
        setUrl={p.setUrl}
        onClose={p.onClose}
        onSubmitAdd={p.onSubmitAdd}
        onSubmitEdit={p.onSubmitEdit}
        addPending={p.addPending}
        editPending={p.editPending}
      />
      <TenantDeleteModal
        isOpen={p.isDeleteOpen}
        tenantName={p.selected?.name || ""}
        onClose={p.onClose}
        onConfirm={p.onConfirmDelete}
        isSubmitting={p.deletePending}
      />
    </>
  );
}
