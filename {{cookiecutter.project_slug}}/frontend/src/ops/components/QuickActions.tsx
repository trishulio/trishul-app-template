import { Link } from "react-router-dom";
import { Cpu, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  {
    to: "/tenants",
    title: "Manage Tenants",
    description: "Provision / Edit CRM nodes",
  },
  {
    to: "/health",
    title: "Actuator Status",
    description: "Inspect liveness & probes",
  },
  {
    to: "/beans",
    title: "Beans Directory",
    description: "View Spring application context",
  },
];

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 className="text-md font-bold flex items-center gap-2.5 mb-2">
        <Cpu className="h-5 w-5 text-amber-500" />
        Engineering Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/[0.03] transition-all group"
          >
            <div>
              <h4 className="text-sm font-semibold group-hover:text-amber-500 transition-colors">
                {link.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {link.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
