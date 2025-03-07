import * as Schema from "effect/Schema";

export type Input = typeof Input;
export const Input = Schema.Struct({
  sections: Schema.optional(Schema.String),
  sections_url: Schema.optional(Schema.String),
});

// Helper type to convert a string to a tuple of unique literals
type UniqueKeys<T extends string> = T extends `${infer K},${infer Rest}`
  ? K | UniqueKeys<Rest>
  : T;

const parseKeys = <const T extends string>(keys: T) =>
  Array.from(
    new Set(keys.split(",").map((key) => key.trim())),
  ) as UniqueKeys<T>[];

export function makeResponseSchema<const T extends string>(input: T) {
  const keys = parseKeys(input);
  return Schema.Record({
    key: Schema.Literal(...keys),
    value: Schema.NullOr(Schema.String),
  });
}
