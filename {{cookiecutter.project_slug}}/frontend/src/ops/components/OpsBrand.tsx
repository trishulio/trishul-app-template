import { Terminal } from "lucide-react";

interface OpsBrandProps {
  subtitle?: string;
}

export function OpsBrand({ subtitle }: OpsBrandProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-amber-500 text-white">
        <Terminal className="h-5 w-5" />
      </div>
      <div className="overflow-hidden">
        <h1 className="font-bold text-lg tracking-tight leading-none">
          {"{{cookiecutter.project_name}}"} Ops
        </h1>
        {subtitle && (
          <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
