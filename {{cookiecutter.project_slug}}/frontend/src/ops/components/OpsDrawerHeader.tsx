import { Terminal, X } from "lucide-react";

interface OpsDrawerHeaderProps {
  onClose: () => void;
}

export function OpsDrawerHeader({ onClose }: OpsDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <Terminal className="h-5 w-5 text-amber-500" />
        <span className="font-bold text-md">
          {"{{cookiecutter.project_name}}"} Ops
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
