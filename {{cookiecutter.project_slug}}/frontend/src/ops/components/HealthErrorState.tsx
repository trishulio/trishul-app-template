import { AlertOctagon } from "lucide-react";

export function HealthErrorState() {
  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-5">
      <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/20 text-red-500 flex-shrink-0">
        <AlertOctagon className="h-8 w-8" />
      </div>
      <div className="space-y-2 text-center sm:text-left">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          Actuator Endpoint Unreachable
        </h3>
        <p className="text-sm text-slate-500 max-w-lg">
          Could not fetch health from `/actuator/health`. Make sure the backend
          server is running and actuator dependencies are fully configured in
          the application pom.xml.
        </p>
      </div>
    </div>
  );
}
