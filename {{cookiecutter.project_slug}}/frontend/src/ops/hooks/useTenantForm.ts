import type { FormEvent } from "react";
import { useState } from "react";
import type { TenantDto } from "@/lib/api/model/tenantDto";
import { validateTenantFields } from "../tenantFormLogic";

type ModalKind = "add" | "edit" | "delete" | null;

type Actions = {
  onAdd: (name: string, url: string) => void;
  onEdit: (id: string, name: string, url: string) => void;
  onDelete: (id: string) => void;
};

export function useTenantForm({ onAdd, onEdit, onDelete }: Actions) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<TenantDto | null>(null);

  const close = () => {
    setName("");
    setUrl("");
    setSelected(null);
    setModal(null);
  };

  const open = (kind: "add" | "edit" | "delete", t?: TenantDto) => {
    setName(t?.name ?? "");
    setUrl(t?.url ?? "");
    setSelected(t ?? null);
    setModal(kind);
  };

  const submit = (e: FormEvent, kind: "add" | "edit") => {
    e.preventDefault();
    const p = validateTenantFields(name, url);
    if (!p) return;
    if (kind === "add") onAdd(p.name, p.url);
    else if (selected?.id) onEdit(selected.id, p.name, p.url);
  };

  return {
    name,
    setName,
    url,
    setUrl,
    selectedTenant: selected,
    closeForms: close,
    isAddOpen: modal === "add",
    isEditOpen: modal === "edit",
    isDeleteOpen: modal === "delete",
    handleOpenAdd: () => open("add"),
    handleOpenEdit: (t: TenantDto) => open("edit", t),
    handleOpenDelete: (t: TenantDto) => open("delete", t),
    handleAddSubmit: (e: FormEvent) => submit(e, "add"),
    handleEditSubmit: (e: FormEvent) => submit(e, "edit"),
    handleDeleteConfirm: () => selected?.id && onDelete(selected.id),
  };
}
