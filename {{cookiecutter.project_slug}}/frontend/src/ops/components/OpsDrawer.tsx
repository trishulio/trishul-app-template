import type { NavItem } from "../layoutData";
import { OpsDrawerHeader } from "./OpsDrawerHeader";
import { SidebarNav } from "./SidebarNav";
import type { ThemeSwitcher } from "./ThemeSwitch";
import { OpsMobileUserFooter } from "./OpsMobileUserFooter";

interface OpsDrawerProps {
  open: boolean;
  items: NavItem[];
  pathname: string;
  displayName?: string;
  email?: string;
  themeProps: ThemeSwitcher;
  onClose: () => void;
  onLogout: () => void;
}

export function OpsDrawer(props: OpsDrawerProps) {
  if (!props.open) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40 transition-opacity">
      <button
        type="button"
        aria-label="Close navigation menu"
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={props.onClose}
      />
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-5 shadow-2xl transition-transform animate-slide-in z-10">
        <OpsDrawerHeader onClose={props.onClose} />

        <SidebarNav
          items={props.items}
          pathname={props.pathname}
          onNavigate={props.onClose}
        />

        <OpsMobileUserFooter
          displayName={props.displayName}
          email={props.email}
          themeProps={props.themeProps}
          onLogout={props.onLogout}
        />
      </div>
    </div>
  );
}
