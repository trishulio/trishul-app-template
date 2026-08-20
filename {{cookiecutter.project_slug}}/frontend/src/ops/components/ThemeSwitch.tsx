import { Sun, Moon } from "lucide-react";

export interface ThemeSwitcher {
  theme?: string;
  onToggle: () => void;
}

export function ThemeSwitch({ theme, onToggle }: ThemeSwitcher) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
