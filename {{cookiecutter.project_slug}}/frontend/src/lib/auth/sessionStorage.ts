const store = (
  typeof window !== "undefined" ? window.sessionStorage : undefined
) as Storage | undefined;

export const sessionStorageAdapter = {
  getItem: (key: string): string | null => store?.getItem(key) ?? null,
  setItem: (key: string, value: string): void => {
    store?.setItem(key, value);
  },
  removeItem: (key: string): void => {
    store?.removeItem(key);
  },
};
