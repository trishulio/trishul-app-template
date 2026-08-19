import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Database,
  Activity,
  Cpu,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  Terminal,
} from "lucide-react";

export function OpsLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Tenant Management", href: "/tenants", icon: Database },
    { name: "Actuator Health", href: "/health", icon: Activity },
    { name: "Actuator Beans", href: "/beans", icon: Cpu },
  ];

  const isLinkActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="flex h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2 rounded-lg bg-amber-500 text-white">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">{"{{cookiecutter.project_name}}"} Ops</h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">
              Engineering Console
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
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

        {/* Footer controls & Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            {/* User display */}
            <div className="flex items-center gap-2 max-w-[150px]">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold truncate leading-none mb-1">
                  {user?.displayName || "Engineer"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none">
                  {user?.email || "ops@example.com"}
                </p>
              </div>
            </div>

            {/* Theme switcher */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-md">{"{{cookiecutter.project_name}}"} Ops</span>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </header>

        {/* Mobile Menu Drawer Overlay */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 transition-opacity">
            <button
              type="button"
              aria-label="Close navigation menu"
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-5 shadow-2xl transition-transform animate-slide-in z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-amber-500" />
                  <span className="font-bold text-md">{"{{cookiecutter.project_name}}"} Ops</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
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

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold truncate leading-none mb-1">
                        {user?.displayName || "Engineer"}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-none">
                        {user?.email || "ops@example.com"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
