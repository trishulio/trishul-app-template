import type { FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function TenantFormModal({
  isOpen,
  title,
  nameLabelId,
  urlLabelId,
  name,
  setName,
  url,
  setUrl,
  onClose,
  onSubmit,
  isSubmitting,
  submitLabel,
  submitButtonClassName,
}: TenantFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label
              id={nameLabelId}
              htmlFor={nameLabelId}
              className="text-xs font-bold text-slate-500 uppercase tracking-wide"
            >
              Tenant Name
            </label>
            <input
              id={nameLabelId}
              type="text"
              placeholder="e.g. Acme Corporation"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              id={urlLabelId}
              htmlFor={urlLabelId}
              className="text-xs font-bold text-slate-500 uppercase tracking-wide"
            >
              Connection URL
            </label>
            <input
              id={urlLabelId}
              type="url"
              placeholder="e.g. jdbc:postgresql://localhost:5432/acme"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={submitButtonClassName}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
