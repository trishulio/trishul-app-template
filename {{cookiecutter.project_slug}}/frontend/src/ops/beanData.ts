import type { ActuatorBeansResponse, BeanInfo } from "./beanTypes";

export function flattenBeans(data?: ActuatorBeansResponse): BeanInfo[] {
  if (!data?.contexts) return [];
  const list: BeanInfo[] = [];
  Object.entries(data.contexts).forEach(([ctxName, ctxData]) => {
    if (!ctxData.beans) return;
    Object.entries(ctxData.beans).forEach(([beanName, bean]) => {
      list.push({ name: beanName, context: ctxName, ...bean });
    });
  });
  return list;
}

export function collectScopes(beans: BeanInfo[]): string[] {
  return Array.from(new Set(beans.map((b) => b.scope).filter(Boolean)));
}

export function filterBeans(
  beans: BeanInfo[],
  search: string,
  scopeFilter: string,
): BeanInfo[] {
  const q = search.toLowerCase();
  return beans.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q);
    const matchesScope = scopeFilter === "all" || b.scope === scopeFilter;
    return matchesSearch && matchesScope;
  });
}
