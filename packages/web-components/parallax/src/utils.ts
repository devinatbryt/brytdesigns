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
