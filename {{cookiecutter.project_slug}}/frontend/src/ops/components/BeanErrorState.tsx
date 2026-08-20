import { AlertTriangle } from "lucide-react";

export function BeanErrorState() {
  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8">
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <h3 className="font-bold text-lg">
        Beans Endpoint Disabled or Unreachable
      </h3>
      <p className="text-sm text-slate-500 mt-2">
        Could not retrieve Spring beans. Ensure `/actuator/beans` is enabled by
        setting `management.endpoints.web.exposure.include=*`.
      </p>
    </div>
  );
}
