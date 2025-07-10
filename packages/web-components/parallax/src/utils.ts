export function normalizeTuple(range: [number, number], max: number) {
  if (max <= 1) {
    throw new Error("The maximum value must be greater than 1.");
  }

  const [start, end] = range;
  const normalizedStart = (start - 1) / (max - 1);
  const normalizedEnd = (end - 1) / (max - 1);

  return [normalizedStart, normalizedEnd] as const;
}

export function isInRange({
  range: [start, end],
  value,
}: {
  range: [number, number];
  value: number;
}) {
  return start <= value && end >= value;
}

export function getLastMatchingMediaQueryIndex(queries: string[]): number {
  let lastMatchIndex = -1;

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    if (typeof query !== "string") continue;
    if (window.matchMedia(query).matches) {
      lastMatchIndex = i;
    }
  }

  return lastMatchIndex;
}

export function getActiveBreakpoints(queries: string[]): boolean[] {
  return queries.map((query) => window.matchMedia(query).matches);
}

export function getLastTruthyIndex(values: boolean[]): number {
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i]) return i;
  }
  return -1;
}
export function getLastValidValue<T>(
  arr: (T | null)[],
  index: number,
): T | null {
  if (arr[index] != null) return arr[index]!;

  for (let i = index - 1; i >= 0; i--) {
    if (arr[i] != null) return arr[i]!;
  }

  return null;
}
