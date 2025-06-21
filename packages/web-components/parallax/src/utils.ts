import type { AnimationPlaybackControlsWithThen } from "motion";

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

export function abortablePromise(promise: Promise<any>, signal: AbortSignal) {
  if (signal.aborted) {
    return new Promise((_, rej) => rej(signal.reason));
  }

  return new Promise(async (res, rej) => {
    signal.addEventListener(
      "abort",
      () => {
        rej(signal.reason);
      },
      { once: true },
    );
    promise.then(res);
  });
}

export function awaitAllAnimations(
  promises: AnimationPlaybackControlsWithThen[],
) {
  return new Promise((resolve, _) => {
    const results: any[] = [];
    let remaining = promises.length;
    if (remaining === 0) {
      resolve([]); // zero‐length edge case
      return;
    }

    function updateResults<T>(value: T, index: number) {
      results[index] = value;
      remaining -= 1;
      if (remaining === 0) {
        resolve(results);
      }
    }

    promises.forEach((p, i) => {
      try {
        if (p?.state === "idle") {
          updateResults(null, i);
        } else {
          p.then(() => {
            updateResults(null, i);
          });
        }
      } catch (e) {
        p.then(() => {
          updateResults(null, i);
        });
      }
    });
  });
}

export async function controlPromise(
  controls: AnimationPlaybackControlsWithThen,
) {
  return new Promise((resolve) => {
    controls.then(() => resolve(null));
  });
}
