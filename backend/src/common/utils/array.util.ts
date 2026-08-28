export const createMapFromArray = <T, K extends keyof T>(
  items: readonly T[],
  key: K,
): Record<string, T> =>
  Object.fromEntries(items.map((item) => [String(item[key]), item]));

export const makeUniqueArray = <T>(values: readonly T[]): T[] => [
  ...new Set(values.filter(Boolean)),
];
