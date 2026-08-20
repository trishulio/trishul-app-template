import { Terminal, Menu, X } from "lucide-react";

interface OpsMobileHeaderProps {
  open: boolean;
  onToggle: () => void;
}

export function OpsMobileHeader({ open, onToggle }: OpsMobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Terminal className="h-5 w-5 text-amber-500" />
        <span className="font-bold text-md">
          {"{{cookiecutter.project_name}}"} Ops
        </span>
      </div>

      <button
        onClick={onToggle}
        className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </header>
  );
}
