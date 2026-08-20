import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function DashboardClock() {
  const [refreshedAt, setRefreshedAt] = useState("");

  useEffect(() => {
    const tick = () => setRefreshedAt(new Date().toLocaleTimeString());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
      <Clock className="h-3.5 w-3.5" />
      Refreshed: {refreshedAt}
    </div>
  );
}
