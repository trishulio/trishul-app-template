import { User, LogOut } from "lucide-react";
import type { ThemeSwitcher } from "./ThemeSwitch";
import { ThemeSwitch } from "./ThemeSwitch";

interface OpsUserFooterProps {
  displayName?: string;
  email?: string;
  onLogout: () => void;
  themeProps: ThemeSwitcher;
}

export function OpsUserFooter({
  displayName,
  email,
  onLogout,
  themeProps,
}: OpsUserFooterProps) {
  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-[150px]">
          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold truncate leading-none mb-1">
              {displayName || "Engineer"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none">
              {email || "ops@example.com"}
            </p>
          </div>
        </div>
        <ThemeSwitch {...themeProps} />
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-[0.98]"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
}
