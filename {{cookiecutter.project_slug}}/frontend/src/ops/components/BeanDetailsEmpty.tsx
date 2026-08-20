import { Cpu } from "lucide-react";

export function BeanDetailsEmpty() {
  return (
    <div className="hidden lg:flex w-96 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl items-center justify-center p-6 text-center flex-shrink-0 text-slate-400 bg-white dark:bg-slate-900/40">
      <div className="space-y-2">
        <Cpu className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
        <h4 className="text-sm font-semibold">No bean selected</h4>
        <p className="text-xs max-w-[200px] mx-auto text-slate-500">
          Select a bean from the explorer list to examine its full wiring graph
          and resource metrics.
        </p>
      </div>
    </div>
  );
}
