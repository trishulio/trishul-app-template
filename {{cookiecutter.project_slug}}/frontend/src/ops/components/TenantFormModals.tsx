import type { FormEvent } from "react";
import { TenantFormModal } from "./TenantFormModal";

interface TenantFormModalsProps {
  addOpen: boolean;
  editOpen: boolean;
  name: string;
  setName: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  onClose: () => void;
  onSubmitAdd: (event: FormEvent) => void;
  onSubmitEdit: (event: FormEvent) => void;
  addPending: boolean;
  editPending: boolean;
}

const BTN =
  "flex-1 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold";

export function TenantFormModals(p: TenantFormModalsProps) {
  const common = {
    name: p.name,
    setName: p.setName,
    url: p.url,
    setUrl: p.setUrl,
    onClose: p.onClose,
    submitButtonClassName: BTN,
  };

  return (
    <>
      <TenantFormModal
        {...common}
        isOpen={p.addOpen}
        title="Provision New Tenant"
        nameLabelId="tenant-name"
        urlLabelId="tenant-url"
        onSubmit={p.onSubmitAdd}
        isSubmitting={p.addPending}
        submitLabel="Save & Init"
      />
      <TenantFormModal
        {...common}
        isOpen={p.editOpen}
        title="Modify Tenant Details"
        nameLabelId="tenant-edit-name"
        urlLabelId="tenant-edit-url"
        onSubmit={p.onSubmitEdit}
        isSubmitting={p.editPending}
        submitLabel="Save Changes"
      />
    </>
  );
}
