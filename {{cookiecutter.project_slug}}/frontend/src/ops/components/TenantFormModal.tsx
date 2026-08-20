import type { FormEvent } from "react";
import { ModalShell } from "./ModalShell";
import { FieldInput } from "./FieldInput";
import { FormActions } from "./FormActions";

interface TenantFormModalProps {
  isOpen: boolean;
  title: string;
  nameLabelId: string;
  urlLabelId: string;
  name: string;
  setName: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  isSubmitting: boolean;
  submitLabel: string;
  submitButtonClassName: string;
}

export function TenantFormModal(props: TenantFormModalProps) {
  return (
    <ModalShell open={props.isOpen} title={props.title} onClose={props.onClose}>
      <form onSubmit={props.onSubmit} className="p-6 space-y-4">
        <FieldInput
          id={props.nameLabelId}
          label="Tenant Name"
          placeholder="e.g. Acme Corporation"
          value={props.name}
          onChange={props.setName}
          required
        />
        <FieldInput
          id={props.urlLabelId}
          type="url"
          label="Connection URL"
          placeholder="e.g. jdbc:postgresql://localhost:5432/acme"
          value={props.url}
          onChange={props.setUrl}
          required
        />
        <FormActions
          onClose={props.onClose}
          isSubmitting={props.isSubmitting}
          submitLabel={props.submitLabel}
          submitButtonClassName={props.submitButtonClassName}
        />
      </form>
    </ModalShell>
  );
}
