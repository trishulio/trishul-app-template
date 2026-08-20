import type { NavItem } from "../layoutData";
import { OpsBrand } from "./OpsBrand";
import { SidebarNav } from "./SidebarNav";
import { OpsUserFooter } from "./OpsUserFooter";
import type { ThemeSwitcher } from "./ThemeSwitch";

interface OpsDesktopSidebarProps {
  items: NavItem[];
  pathname: string;
  displayName?: string;
  email?: string;
  themeProps: ThemeSwitcher;
  onLogout: () => void;
}

export function OpsDesktopSidebar({
  items,
  pathname,
  displayName,
  email,
  themeProps,
  onLogout,
}: OpsDesktopSidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <OpsBrand subtitle="Engineering Console" />
      </div>
      <SidebarNav items={items} pathname={pathname} />
      <OpsUserFooter
        displayName={displayName}
        email={email}
        themeProps={themeProps}
        onLogout={onLogout}
      />
    </aside>
  );
}
