import type { LucideIcon } from "lucide-react";

interface BeanDetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  mono?: boolean;
  breakAll?: boolean;
}

export function BeanDetailRow({
  icon: Icon,
  label,
  value,
  mono,
  breakAll,
}: BeanDetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
      <div className="space-y-0.5 overflow-hidden">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          {label}
        </span>
        <span
          className={`text-sm font-medium${mono ? " font-mono" : ""} text-slate-600 dark:text-slate-300${breakAll ? " break-all" : ""}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
