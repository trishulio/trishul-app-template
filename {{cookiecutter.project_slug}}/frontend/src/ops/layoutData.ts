import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Database, Activity, Cpu } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const NAVIGATION: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tenant Management", href: "/tenants", icon: Database },
  { name: "Actuator Health", href: "/health", icon: Activity },
  { name: "Actuator Beans", href: "/beans", icon: Cpu },
];

export function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href;
}
