import type { StatInputs } from "./dashboardStats";

export const loadingTone = {
  color: "text-slate-400 bg-slate-100 dark:bg-slate-800",
  iconColor: "text-slate-500",
};
export const goodTone = {
  color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
  iconColor: "text-emerald-500",
};
export const redTone = {
  color: "text-red-500 bg-red-50 dark:bg-red-950/20",
  iconColor: "text-red-500",
};

export function healthTone(input: StatInputs) {
  if (input.healthLoading) return loadingTone;
  return input.isHealthy ? goodTone : redTone;
}

export function healthValue(input: StatInputs) {
  if (input.healthLoading) return "Checking...";
  return input.isHealthy ? "Healthy" : "Degraded";
}

export function healthDesc(input: StatInputs) {
  if (input.healthLoading) return "Contacting actuator...";
  return input.isHealthy ? "All services UP" : "Service disruption detected";
}

export function dbTone(input: StatInputs) {
  return input.dbStatus === "UP"
    ? goodTone
    : {
        color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20",
        iconColor: "text-rose-500",
      };
}
