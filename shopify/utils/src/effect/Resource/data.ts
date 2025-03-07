import type { ParseError } from "effect/ParseResult";

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { ID, GID, Type } from "./schema.js";

type FormatOptions<T extends ID, R extends Type> = {
  id: T;
  type: R;
};

export const format = <const T extends ID, const R extends Type>({
  id,
  type,
}: FormatOptions<T, R>): Effect.Effect<
  `gid://shopify/${R}/${T}`,
  ParseError,
  never
> =>
  Effect.gen(function* () {
    const actualId = yield* Schema.decode(ID)(id);
    const actualType = yield* Schema.decode(Type)(type);
    return `gid://shopify/${actualType}/${actualId}` as `gid://shopify/${R}/${T}`;
  });

export const parse = (
  input: string
): Effect.Effect<string, ParseError, never> => Schema.decode(GID)(input);
