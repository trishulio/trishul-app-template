import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "next-themes";
import { NAVIGATION } from "./layoutData";
import { OpsDesktopSidebar } from "./components/OpsDesktopSidebar";
import { OpsMobileHeader } from "./components/OpsMobileHeader";
import { OpsDrawer } from "./components/OpsDrawer";

export function OpsLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();

  const themeProps = {
    theme,
    onToggle: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
  const onLogout = () => {
    setMobileOpen(false);
    logout();
  };

  return (
    <div className="flex h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      <OpsDesktopSidebar
        items={NAVIGATION}
        pathname={pathname}
        displayName={user?.displayName}
        email={user?.email}
        themeProps={themeProps}
        onLogout={onLogout}
      />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <OpsMobileHeader
          open={mobileOpen}
          onToggle={() => setMobileOpen(!mobileOpen)}
        />
        <OpsDrawer
          open={mobileOpen}
          items={NAVIGATION}
          pathname={pathname}
          displayName={user?.displayName}
          email={user?.email}
          themeProps={themeProps}
          onClose={() => setMobileOpen(false)}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
