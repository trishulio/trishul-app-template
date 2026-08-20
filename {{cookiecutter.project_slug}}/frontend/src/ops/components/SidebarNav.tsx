import { Link } from "react-router-dom";
import type { NavItem } from "../layoutData";
import { isLinkActive } from "../layoutData";

interface SidebarNavProps {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}

export function SidebarNav({ items, pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isLinkActive(pathname, item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              active
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
