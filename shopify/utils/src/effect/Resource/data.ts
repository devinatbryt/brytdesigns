import type { ParseError } from "effect/ParseResult";

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as ParseResult from "effect/ParseResult";
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
    const [actualId, actualType] = yield* Effect.all(
      [Schema.decode(ID)(id), Schema.decode(Type)(type)],
      {
        concurrency: "unbounded",
      },
    );
    return `gid://shopify/${actualType}/${actualId}` as `gid://shopify/${R}/${T}`;
  });

export const parse = (input: string) =>
  Schema.decode(
    Schema.transformOrFail(GID, ID, {
      encode: (value, _, ast) =>
        ParseResult.fail(
          new ParseResult.Forbidden(
            ast,
            value,
            "Encoding an ID to a GID is not allowed. Use the format function to convert IDs to GIDs.",
          ),
        ),
      decode: (value) => ParseResult.succeed(`${value}`.split("/").pop()!),
    }),
  )(input);
