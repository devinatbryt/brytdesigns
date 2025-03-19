import * as Schema from "effect/Schema";

export type Type = Schema.Schema.Type<typeof Type>;
export const Type = Schema.Literal(
  "Cart",
  "Collection",
  "Customer",
  "DeliveryCarrierService",
  "DeliveryLocationGroup",
  "DeliveryProfile",
  "DeliveryZone",
  "DraftOrder",
  "DraftOrderLineItem",
  "Duty",
  "EmailTemplate",
  "Fulfillment",
  "FulfullmentEvent",
  "FullfullmentService",
  "InventoryItem",
  "InventoryLevel",
  "LineItem",
  "Location",
  "MarketingEvent",
  "MediaImage",
  "Metafield",
  "OnlineStoreArticle",
  "OnlineStoreBlog",
  "OnlineStorePage",
  "Order",
  "OrderTransaction",
  "Product",
  "ProductImage",
  "ProductVariant",
  "Refund",
  "Shop",
  "StaffMember",
  "Theme",
);

export type GID = Schema.Schema.Encoded<typeof GID>;
export const GID = Schema.String.pipe(Schema.startsWith("gid://shopify/"));

export type ID = Schema.Schema.Encoded<typeof ID>;
export const ID = Schema.Union(
  Schema.Number,
  Schema.NumberFromString,
  Schema.String,
);
