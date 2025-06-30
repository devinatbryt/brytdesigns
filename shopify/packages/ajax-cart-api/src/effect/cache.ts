import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import lz from "lz-string";

interface CacheEntry<V> {
  value: V;
  expiresAt?: number;
}

const Cache = {
  get<V>(key: string): V | null {
    const json = localStorage.getItem(key);
    if (!json) return null;
    try {
      const entry = JSON.parse(lz.decompressFromUTF16(json)) as CacheEntry<V>;
      if (entry.expiresAt !== undefined && Date.now() > entry.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },

  set<V>(key: string, value: V, timeToLive?: Duration.DurationInput): void {
    const entry: CacheEntry<V> = { value };
    if (timeToLive !== undefined) {
      const ttlMs = Duration.toMillis(timeToLive);
      entry.expiresAt = Date.now() + ttlMs;
    }
    localStorage.setItem(key, lz.compressToUTF16(JSON.stringify(entry)));
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },
};

export const set = <V>(
  key: string,
  value: V,
  ttl?: Duration.DurationInput,
): Effect.Effect<void, never> => Effect.sync(() => Cache.set(key, value, ttl));

export const get = <V>(key: string): Effect.Effect<V | null, never> =>
  Effect.sync(() => Cache.get(key));

export const remove = (key: string): Effect.Effect<void, never> =>
  Effect.sync(() => Cache.remove(key));
