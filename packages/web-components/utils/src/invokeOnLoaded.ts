import { checkLoaded } from "./checkLoaded.js";

export function invokeOnLoaded(
  fn: () => void,
  { signal }: { signal?: AbortSignal },
) {
  if (checkLoaded()) {
    const id = setTimeout(() => fn());
    signal?.addEventListener("abort", () => clearTimeout(id));
  }
  window.addEventListener("DOMContentLoaded", fn, { signal });
}
