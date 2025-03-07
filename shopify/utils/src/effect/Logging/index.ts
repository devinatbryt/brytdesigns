import * as Effect from "effect/Effect";
import * as FiberRef from "effect/FiberRef";
import * as LogLevel from "effect/LogLevel";

export const filterLevelOrNever = <A, E, R>(
  level: LogLevel.LogLevel,
  effect: Effect.Effect<A, E, R>
) =>
  Effect.gen(function* () {
    const logLevel = yield* FiberRef.get(FiberRef.currentMinimumLogLevel);
    if (logLevel._tag !== level._tag) return yield* effect;
  });

export const makeNamespacedLogSpan = (prefix: string) => (label: string) =>
  Effect.withLogSpan(`${prefix}:${label}`);
