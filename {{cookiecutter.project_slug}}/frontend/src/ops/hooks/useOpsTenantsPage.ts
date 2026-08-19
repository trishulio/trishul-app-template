import type { FormEvent } from "react";
import { useState } from "react";
import {
  useAddTenant,
  useDeleteTenants,
  useGetAll,
  useUpdateTenant,
} from "@/lib/api/client";
import type { TenantDto } from "@/lib/api/model/tenantDto";
import { toast } from "sonner";

const pageSize = 10;

export function useOpsTenantsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<TenantDto | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAll({
    page,
    size: pageSize,
    names: search ? [search] : undefined,
    urls: search ? [search] : undefined,
  });

  const tenants = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? tenants.length;

  const resetFormState = () => {
    setName("");
    setUrl("");
  };

  const closeForms = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedTenant(null);
    resetFormState();
  };

  const addMutation = useAddTenant({
    mutation: {
      onSuccess: () => {
        toast.success("Tenant provisioned");
        closeForms();
        void refetch();
      },
      onError: () => {
        toast.error("Failed to provision tenant");
      },
    },
  });

  const updateMutation = useUpdateTenant({
    mutation: {
      onSuccess: () => {
        toast.success("Tenant updated");
        closeForms();
        void refetch();
      },
      onError: () => {
        toast.error("Failed to update tenant");
      },
    },
  });

  const deleteMutation = useDeleteTenants({
    mutation: {
      onSuccess: () => {
        toast.success("Tenant deleted");
        closeForms();
        void refetch();
      },
      onError: () => {
        toast.error("Failed to delete tenant");
      },
    },
  });

  const handleOpenAdd = () => {
    setSelectedTenant(null);
    resetFormState();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (tenant: TenantDto) => {
    setSelectedTenant(tenant);
    setName(tenant.name ?? "");
    setUrl(tenant.url ?? "");
    setIsEditOpen(true);
  };

  const handleOpenDelete = (tenant: TenantDto) => {
    setSelectedTenant(tenant);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) {
      toast.error("Tenant name and connection URL are required");
      return;
    }

    addMutation.mutate({
      data: [{ name: trimmedName, url: trimmedUrl }],
    });
  };

  const handleEditSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!selectedTenant?.id) {
      toast.error("Select a tenant to update");
      return;
    }

    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) {
      toast.error("Tenant name and connection URL are required");
      return;
    }

    updateMutation.mutate({
      data: [{ id: selectedTenant.id, name: trimmedName, url: trimmedUrl }],
    });
  };

  const handleDeleteConfirm = () => {
    if (!selectedTenant?.id) {
      toast.error("Select a tenant to delete");
      return;
    }

    deleteMutation.mutate({ params: { ids: [selectedTenant.id] } });
  };

  return {
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
  };
}
