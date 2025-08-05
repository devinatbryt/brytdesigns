// 🔥 Recursively Constructs All Possible Paths for an Object or Array
export type Path<T> = T extends readonly (infer U)[]
  ? `${number}` | `${number}.${Path<U>}` // Allows indexing into readonly arrays
  : T extends object
    ? {
        [K in keyof T & (string | number)]: T[K] extends object | any[]
          ? `${K}` | `${K}.${Path<T[K]>}`
          : `${K}`;
      }[keyof T & (string | number)]
    : never;

// 🔥 Correctly Extracts the Value at the Given Path
export type PathValue<
  T,
  P extends string,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : Key extends `${number}`
      ? T extends readonly (infer U)[]
        ? PathValue<U, Rest>
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${number}`
      ? T extends readonly (infer U)[]
        ? U
        : undefined
      : undefined;

export function getValueFromPath<T, P extends Path<T>>(
  obj: T,
  path: P,
): PathValue<T, P> {
  return path.split(".").reduce<any>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;

    // 🔥 Convert numeric keys for proper array indexing
    const isArrayIndex = !isNaN(Number(key)) && key.trim() !== "";
    if (Array.isArray(acc) && isArrayIndex) {
      return acc[Number(key)];
    }

    // Normal object property access
    return acc[key];
  }, obj) as PathValue<T, P>;
}
