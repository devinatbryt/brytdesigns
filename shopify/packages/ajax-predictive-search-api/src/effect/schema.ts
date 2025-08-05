import * as Schema from "effect/Schema";
import { Ajax, Resource } from "@brytdesigns/shopify-utils/effect";

export type Input = Schema.Schema.Encoded<typeof Input>;
export const Input = Schema.extend(
  Ajax.Sections.Input,
  Schema.Struct({
    q: Schema.String,
    resources: Schema.optional(
      Schema.Struct({
        limit: Schema.optionalWith(Schema.Number.pipe(Schema.between(1, 10)), {
          default: () => 10,
        }),
        limit_scope: Schema.optionalWith(Schema.Literal("all", "each"), {
          default: () => "all",
        }),
        options: Schema.optional(
          Schema.Struct({
            unavailable_products: Schema.optionalWith(
              Schema.Literal("show", "hide", "last"),
              { default: () => "last" },
            ),
            fields: Schema.optional(
              Schema.transform(
                Schema.Array(
                  Schema.Literal(
                    "author",
                    "body",
                    "product_type",
                    "tag",
                    "title",
                    "variants.barcode",
                    "variants.sku",
                    "variants.title",
                    "vendor",
                  ),
                ),
                Schema.String,
                {
                  decode(fields) {
                    return fields.join(",");
                  },
                  encode(fields) {
                    return fields.split(",") as any;
                  },
                },
              ),
            ),
          }),
        ),
      }),
    ),
  }),
);

export const Image = Schema.Struct({
  aspect_ratio: Schema.NullOr(Schema.Number),
  alt: Schema.NullOr(Schema.String),
  height: Schema.NullOr(Schema.Number),
  url: Schema.NullOr(Schema.String),
  width: Schema.NullOr(Schema.Number),
});

const Variant = Schema.Struct({
  available: Schema.Boolean,
  compare_at_price: Schema.NullOr(Schema.NumberFromString),
  id: Resource.ID,
  image: Schema.NullOr(Schema.String),
  price: Schema.NumberFromString,
  title: Schema.String,
  url: Schema.String,
  featured_image: Image,
});

const Product = Schema.Struct({
  available: Schema.Boolean,
  body: Schema.String,
  compare_at_price_max: Schema.NumberFromString,
  compare_at_price_min: Schema.NumberFromString,
  handle: Schema.String,
  id: Resource.ID,
  image: Schema.NullOr(Schema.String),
  price: Schema.NumberFromString,
  price_max: Schema.NumberFromString,
  price_min: Schema.NumberFromString,
  tags: Schema.optionalWith(Schema.Array(Schema.String), { default: () => [] }),
  title: Schema.String,
  type: Schema.String,
  url: Schema.String,
  variants: Schema.Array(Variant),
  vendor: Schema.NullOr(Schema.String),
  featured_image: Image,
});

const Collection = Schema.Struct({
  body: Schema.String,
  handle: Schema.String,
  id: Resource.ID,
  featured_image: Image,
  published_at: Schema.DateFromString,
  title: Schema.String,
  url: Schema.String,
});

const Query = Schema.Struct({
  url: Schema.String,
  text: Schema.String,
  styled_text: Schema.String,
});

const Page = Schema.Struct({
  author: Schema.String,
  body: Schema.String,
  handle: Schema.String,
  id: Resource.ID,
  published_at: Schema.DateFromString,
  title: Schema.String,
  url: Schema.String,
});

const Article = Schema.Struct({
  author: Schema.String,
  body: Schema.String,
  handle: Schema.String,
  id: Resource.ID,
  published_at: Schema.DateFromString,
  summary_html: Schema.String,
  tags: Schema.optionalWith(Schema.Array(Schema.String), { default: () => [] }),
  title: Schema.String,
  url: Schema.String,
});

export const Output = Schema.Struct({
  resources: Schema.Struct({
    results: Schema.Struct({
      queries: Schema.optionalWith(Schema.Array(Query), { default: () => [] }),
      products: Schema.optionalWith(Schema.Array(Product), {
        default: () => [],
      }),
      collections: Schema.optionalWith(Schema.Array(Collection), {
        default: () => [],
      }),
      pages: Schema.optionalWith(Schema.Array(Page), { default: () => [] }),
      articles: Schema.optionalWith(Schema.Array(Article), {
        default: () => [],
      }),
    }),
  }),
});
