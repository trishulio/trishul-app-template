import { Button } from "@/components/ui/button";

interface TenantPaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPrev: () => void;
  onNext: () => void;
}

export function TenantPagination({
  page,
  totalPages,
  totalElements,
  onPrev,
  onNext,
}: TenantPaginationProps) {
  return (
    <div className="px-6 py-4 bg-slate-50/[0.2] dark:bg-slate-950/[0.1] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <span className="text-xs text-slate-500 font-medium">
        Showing page {page + 1} of {totalPages} ({totalElements} total records)
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page === totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
