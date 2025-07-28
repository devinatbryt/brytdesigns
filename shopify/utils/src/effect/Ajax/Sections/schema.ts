import * as Schema from "effect/Schema";
import * as ParseResult from "effect/ParseResult";
import * as Function from "effect/Function";

export type Input = typeof Input;
export const Input = Schema.Struct({
  sections: Schema.optional(
    Schema.transform(Schema.Array(Schema.String), Schema.String, {
      decode: (sections) => sections.join(","),
      encode: (str) => str.split(","),
    }),
  ),
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
    value: Schema.transformOrFail(Schema.String, Schema.instanceOf(Element), {
      decode: (htmlString, _, ast) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const root = doc.body.firstElementChild;
        if (!root) {
          return ParseResult.fail(
            new ParseResult.Type(
              ast,
              htmlString,
              "Failed to convert HTML string to Element",
            ),
          );
        }
        return ParseResult.succeed(root);
      },
      encode: (element, options, ast) => ParseResult.succeed(element.outerHTML),
    }).pipe(Schema.NullOr),
  });
}
