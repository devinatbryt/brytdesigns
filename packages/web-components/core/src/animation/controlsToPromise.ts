import type { AnimationPlaybackControlsWithThen } from "motion";

export async function controlsToPromise(
  controls: AnimationPlaybackControlsWithThen,
) {
  return new Promise((resolve) => {
    controls.then(() => resolve(null));
  });
}
