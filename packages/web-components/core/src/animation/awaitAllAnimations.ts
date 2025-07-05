import type { AnimationPlaybackControlsWithThen } from "motion";

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
