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
