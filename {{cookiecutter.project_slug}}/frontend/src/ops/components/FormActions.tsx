import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  submitButtonClassName: string;
}

export function FormActions({
  onClose,
  isSubmitting,
  submitLabel,
  submitButtonClassName,
}: FormActionsProps) {
  return (
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
  );
}
