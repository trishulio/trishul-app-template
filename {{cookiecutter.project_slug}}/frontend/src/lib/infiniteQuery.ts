export function getInfiniteNextPageParam(
  lastPage: { totalPages?: number },
  allPages: unknown[],
) {
  const nextPageIndex = allPages.length;
  if (nextPageIndex >= (lastPage.totalPages ?? 0)) return undefined;
  return nextPageIndex;
}

export const infiniteQueryDefaults = {
  getNextPageParam: getInfiniteNextPageParam,
  initialPageParam: 0,
};