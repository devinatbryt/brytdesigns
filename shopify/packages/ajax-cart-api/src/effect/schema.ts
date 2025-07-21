import * as Schema from "effect/Schema";
import * as Array from "effect/Array";
import * as Record from "effect/Record";
import { Resource, Ajax } from "@brytdesigns/shopify-utils/effect";
import { pipe, identity } from "effect";

type BaseAttributeValue = Schema.Schema.Type<typeof BaseAttributeValue>;
const BaseAttributeValue = Schema.Union(
  Schema.Null,
  Schema.String,
  Schema.Boolean,
  Schema.Number,
);

const AttributesArray = Schema.Array(
  Schema.Struct({ key: Schema.String, value: BaseAttributeValue }),
);

export type BaseAttributes = Schema.Schema.Type<typeof BaseAttributes>;
export const BaseAttributes = Schema.Record({
  key: Schema.String,
  value: BaseAttributeValue,
});

export const BaseAttributesArray = Schema.transform(
  BaseAttributes,
  AttributesArray,
  {
    decode: (record) =>
      Record.toEntries(record).map(([key, value]) => ({ key, value })),
    encode: (array) =>
      Record.fromEntries(
        pipe(
          array,
          Array.map(({ key, value }) => [key, value]),
        ),
      ),
  },
);

const BasePrivateAttributes = Schema.transform(BaseAttributes, BaseAttributes, {
  decode: Record.filter((_, key) => key.startsWith("_")),
  encode: identity,
});

const BasePublicAttributes = Schema.transform(BaseAttributes, BaseAttributes, {
  decode: Record.filter((_, key) => !key.startsWith("_")),
  encode: identity,
});

const BasePrivateAttributesArray = Schema.transform(
  BasePrivateAttributes,
  AttributesArray,
  {
    decode: (record) =>
      Record.toEntries(record).map(([key, value]) => ({ key, value })),
    encode: (array) =>
      Record.fromEntries(
        pipe(
          array,
          Array.map(({ key, value }) => [key, value]),
        ),
      ),
  },
);

const BasePublicAttributesArray = Schema.transform(
  BasePublicAttributes,
  AttributesArray,
  {
    decode: (record) =>
      Record.toEntries(record).map(([key, value]) => ({ key, value })),
    encode: (array) =>
      Record.fromEntries(
        pipe(
          array,
          Array.map(({ key, value }) => [key, value]),
        ),
      ),
  },
);

export const Attributes = Schema.transform(
  BaseAttributes,
  Schema.Struct({
    private: Schema.Struct({
      array: BasePrivateAttributesArray,
      record: BasePrivateAttributes,
    }),
    public: Schema.Struct({
      array: BasePublicAttributesArray,
      record: BasePublicAttributes,
    }),
  }),
  {
    decode: (attributes) => ({
      private: {
        array: attributes,
        record: attributes,
      },
      public: {
        array: attributes,
        record: attributes,
      },
    }),
    encode: (attributes) => ({
      ...attributes.private.record,
      ...attributes.public.record,
    }),
  },
);

export type DiscountApplication = Schema.Schema.Type<
  typeof DiscountApplication
>;

export const DiscountApplication = Schema.Struct({
  target_selection: Schema.Literal("all", "entitled", "explicit"),
  target_type: Schema.Literal("line_item", "shipping_line"),
  title: Schema.NonEmptyString,
  total_allocated_amount: Schema.Number,
  type: Schema.Literal("", "automatic", "discount_code", "manual", "script"),
  value: Schema.Union(Schema.Number, Schema.NumberFromString),
  value_type: Schema.Literal("fixed_amount", "percentage"),
  description: Schema.NullOr(Schema.String),
});

export const Discount = Schema.Struct({
  amount: Schema.Number,
  title: Schema.String,
});

export type CurrencyCode = Schema.Schema.Type<typeof CurrencyCode>;
export const CurrencyCode = Schema.String;

export type Image = Schema.Schema.Type<typeof Image>;
export const Image = Schema.Struct({
  aspect_ratio: Schema.NullOr(Schema.Number),
  alt: Schema.NullOr(Schema.String),
  height: Schema.NullOr(Schema.Number),
  url: Schema.NullOr(Schema.String),
  width: Schema.NullOr(Schema.Number),
});

export type OptionWithValue = Schema.Schema.Type<typeof OptionWithValue>;
export const OptionWithValue = Schema.Struct({
  name: Schema.String,
  value: Schema.String,
});

export type QuantityRule = Schema.Schema.Type<typeof QuantityRule>;
export const QuantityRule = Schema.Struct({
  min: Schema.Number,
  max: Schema.NullOr(Schema.Number),
  increment: Schema.Number,
});

export type SellingPlanAllocationPriceAdjustment = Schema.Schema.Type<
  typeof SellingPlanAllocationPriceAdjustment
>;
export const SellingPlanAllocationPriceAdjustment = Schema.Struct({
  position: Schema.Number,
  price: Schema.Number,
});

export const SellingPlanPriceAdjustment = Schema.Struct({
  order_count: Schema.NullOr(Schema.Number),
  position: Schema.Number,
  value: Schema.Union(Schema.Number, Schema.String),
  value_type: Schema.Literal("percentage", "fixed_amount", "price"),
});

export type SellingPlanOption = Schema.Schema.Type<typeof SellingPlanOption>;
export const SellingPlanOption = Schema.Struct({
  name: Schema.String,
  position: Schema.Number,
  value: Schema.String,
});

export type SellingPlan = Schema.Schema.Type<typeof SellingPlan>;
export const SellingPlan = Schema.Struct({
  id: Resource.ID,
  name: Schema.String,
  description: Schema.NullOr(Schema.String),
  options: Schema.Array(SellingPlanOption),
  recurring_deliveries: Schema.optionalWith(Schema.Boolean, {
    default: () => false,
  }),
  fixed_selling_plan: Schema.optionalWith(Schema.Boolean, {
    default: () => false,
  }),
  price_adjustments: Schema.Array(SellingPlanPriceAdjustment),
});

export type SellingPlanAllocation = Schema.Schema.Type<
  typeof SellingPlanAllocation
>;
export const SellingPlanAllocation = Schema.Struct({
  price_adjustments: Schema.Array(SellingPlanAllocationPriceAdjustment),
  price: Schema.Number,
  compare_at_price: Schema.Number,
  per_delivery_price: Schema.Number,
  selling_plan: SellingPlan,
});

export type LineLevelDiscountAllocation = Schema.Schema.Type<
  typeof LineLevelDiscountAllocation
>;
export const LineLevelDiscountAllocation = Schema.Struct({
  amount: Schema.Number,
  discount_application: DiscountApplication,
});

const CartLevelDiscountApplicationUpdate = Schema.transform(
  Schema.Struct({
    discount_application: DiscountApplication,
  }),
  DiscountApplication,
  {
    decode: (application) => application.discount_application,
    encode: (discountApplication) => ({
      discount_application: discountApplication,
    }),
    strict: false,
  },
);

export const CartLevelDiscountApplication = Schema.Union(
  DiscountApplication,
  CartLevelDiscountApplicationUpdate,
);

export type UnitPriceMeasurement = Schema.Schema.Type<
  typeof UnitPriceMeasurement
>;
export const UnitPriceMeasurement = Schema.Struct({
  measured_type: Schema.Literal("volume", "weight", "dimension"),
  quantity_unit: Schema.String,
  quantity_value: Schema.Number,
  reference_unit: Schema.String,
  reference_value: Schema.Number,
});

const VariantOptions = Schema.optionalWith(Schema.Array(Schema.String), {
  default: () => [],
});

export type BaseLineItem = Schema.Schema.Type<typeof BaseLineItem>;
const BaseLineItem = Schema.Struct({
  id: Resource.ID,
  properties: BaseAttributes,
  quantity: Schema.Number,
  variant_id: Resource.ID,
  key: Schema.String,
  title: Schema.String,
  price: Schema.Number,
  original_price: Schema.Number,
  discounted_price: Schema.Number,
  line_price: Schema.Number,
  original_line_price: Schema.Number,
  total_discount: Schema.Number,
  discounts: Schema.optionalWith(Schema.Array(Discount), { default: () => [] }),
  sku: Schema.NullOr(Schema.String),
  grams: Schema.Number,
  vendor: Schema.String,
  taxable: Schema.Boolean,
  product_id: Resource.ID,
  product_has_only_default_variant: Schema.Boolean,
  gift_card: Schema.Boolean,
  final_line_price: Schema.Number,
  final_price: Schema.Number,
  url: Schema.String,
  featured_image: Image,
  image: Schema.NullOr(Schema.String),
  handle: Schema.String,
  requires_shipping: Schema.Boolean,
  product_type: Schema.NullOr(Schema.String),
  product_title: Schema.String,
  product_description: Schema.NullOr(Schema.String),
  variant_title: Schema.NullOr(Schema.String),
  variant_options: VariantOptions,
  options_with_values: Schema.Array(OptionWithValue),
  line_level_discount_allocations: Schema.Array(LineLevelDiscountAllocation),
  line_level_total_discount: Schema.Number,
  quantity_rule: Schema.optional(QuantityRule),
  has_components: Schema.optionalWith(Schema.Boolean, { default: () => false }),
  unit_price: Schema.optional(Schema.Number),
  unit_price_measurement: Schema.optional(UnitPriceMeasurement),
  selling_plan_allocation: Schema.optionalWith(
    Schema.NullOr(SellingPlanAllocation),
    { default: () => null },
  ),
});

export type LineItem = Schema.Schema.Type<typeof LineItem>;
export const LineItem = Schema.transform(
  BaseLineItem,
  Schema.extend(
    BaseLineItem,
    Schema.Struct({
      properties_array: Schema.optionalWith(BaseAttributesArray, {
        default: () => [],
      }),
      private_properties: Schema.optionalWith(BasePrivateAttributes, {
        default: () => ({}),
      }),
      private_properties_array: Schema.optionalWith(
        BasePrivateAttributesArray,
        {
          default: () => [],
        },
      ),
      public_properties: Schema.optionalWith(BasePublicAttributes, {
        default: () => ({}),
      }),
      public_properties_array: Schema.optionalWith(BasePublicAttributesArray, {
        default: () => [],
      }),
    }),
  ),
  {
    decode: (lineItem) => ({
      ...lineItem,
      product: lineItem.handle,
      properties_array: lineItem.properties,
      private_properties: lineItem.properties,
      private_properties_array: lineItem.properties,
      public_properties: lineItem.properties,
      public_properties_array: lineItem.properties,
    }),
    encode: (lineItem) =>
      pipe(
        Record.remove("properties_array")(lineItem),
        Record.remove("private_properties"),
        Record.remove("private_properties_array"),
        Record.remove("public_properties"),
        Record.remove("public_properties_array"),
      ) as BaseLineItem,
  },
);

type BaseCart = Schema.Schema.Type<typeof BaseCart>;
export const BaseCart = Schema.Struct({
  token: Schema.String,
  note: Schema.NullOr(Schema.String),
  attributes: BaseAttributes,
  discounts: Schema.optionalWith(Schema.Array(Discount), { default: () => [] }),
  discount_codes: Schema.optionalWith(
    Schema.Array(
      Schema.Struct({ code: Schema.String, applicable: Schema.Boolean }),
    ),
    { default: () => [] },
  ),
  original_total_price: Schema.Number,
  total_price: Schema.Number,
  total_discount: Schema.Number,
  total_weight: Schema.Number,
  item_count: Schema.Number,
  items: Schema.Array(LineItem).annotations({ concurrency: "unbounded" }),
  requires_shipping: Schema.Boolean,
  currency: CurrencyCode,
  items_subtotal_price: Schema.Number,
  cart_level_discount_applications: Schema.Array(CartLevelDiscountApplication),
});

type Cart = Schema.Schema.Type<typeof Cart>;
export const Cart = Schema.extend(
  BaseCart,
  Schema.Struct({
    attributes_array: Schema.optionalWith(BaseAttributesArray, {
      default: () => [],
    }),
    private_attributes: Schema.optionalWith(BasePrivateAttributes, {
      default: () => ({}),
    }),
    private_attributes_array: Schema.optionalWith(BasePrivateAttributesArray, {
      default: () => [],
    }),
    public_attributes: Schema.optionalWith(BasePublicAttributes, {
      default: () => ({}),
    }),
    public_attributes_array: Schema.optionalWith(BasePublicAttributesArray, {
      default: () => [],
    }),
  }),
);

export const makeCartTransformSchema = <
  A extends Schema.Schema.Type<typeof BaseCart>,
  I,
  R,
>(
  schema: Schema.Schema<A, I, R>,
) =>
  Schema.transform(schema, Cart, {
    decode: (cart) => ({
      ...cart,
      attributes_array: cart.attributes,
      private_attributes: cart.attributes,
      private_attributes_array: cart.attributes,
      public_attributes: cart.attributes,
      public_attributes_array: cart.attributes,
    }),
    encode: (cart) =>
      pipe(
        Record.remove("attributes_array")(cart),
        Record.remove("private_attributes"),
        Record.remove("private_attributes_array"),
        Record.remove("public_attributes"),
        Record.remove("public_attributes_array"),
      ) as Schema.Schema.Type<Schema.Schema<A, I, R>>,
  });

export const CartOutput = makeCartTransformSchema(BaseCart);

export const makeCartSchema = (sections?: string) => {
  if (sections) {
    return makeCartTransformSchema(
      Schema.extend(
        BaseCart,
        Schema.Struct({
          sections: Schema.optionalWith(
            Schema.NullOr(Ajax.Sections.makeResponseSchema(sections)),
            { default: () => null },
          ),
        }),
      ),
    );
  }
  return makeCartTransformSchema(
    Schema.extend(
      BaseCart,
      Schema.Struct({
        sections: Schema.optionalWith(Schema.Null, { default: () => null }),
      }),
    ),
  );
};

export type AddItemInput = Schema.Schema.Encoded<typeof AddItemInput>;
export const AddItemInput = Schema.Struct({
  id: Resource.ID,
  quantity: Schema.optionalWith(Schema.Number, { default: () => 1 }),
  properties: Schema.optionalWith(BaseAttributes, { default: () => ({}) }),
  selling_plan: Schema.optional(Resource.ID),
});

export const BaseInput = Schema.extend(Ajax.Sections.Input);

export type CartAddInput = Schema.Schema.Encoded<typeof CartAddInput>;
export const CartAddInput = Schema.Struct({
  items: Schema.Array(AddItemInput),
}).pipe(BaseInput);

export type CartAddOutput = Schema.Schema.Type<typeof CartAddOutput>;
export const CartAddOutput = Schema.Struct({
  items: Schema.Array(LineItem),
});

export type UpdateItemRecordInput = Schema.Schema.Encoded<
  typeof UpdateItemRecordInput
>;
export const UpdateItemRecordInput = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
});

const DiscountCodeInput = Schema.Array(Schema.String);
const DiscountCodeTransformed = Schema.String;

export type CartUpdateInput = Schema.Schema.Encoded<typeof CartUpdateInput>;
export const CartUpdateInput = Schema.Struct({
  updates: Schema.optional(
    Schema.Union(UpdateItemRecordInput, Schema.Array(Schema.Number)),
  ),
  note: Schema.optional(Schema.NullOr(Schema.String)),
  attributes: Schema.optional(BaseAttributes),
  discount: Schema.optional(
    Schema.transform(DiscountCodeInput, DiscountCodeTransformed, {
      decode: (input) => input.join(","),
      encode: (input) => input.split(","),
    }),
  ),
}).pipe(BaseInput);

export type ItemAddedChangelog = Schema.Schema.Type<typeof ItemAddedChangelog>;
export const ItemAddedChangelog = Schema.Struct({
  variant_id: Schema.Number,
  quantity: Schema.Number,
});

export type CartUpdateOutput = Schema.Schema.Type<typeof CartUpdateOutput>;
export const CartUpdateOutput = makeCartTransformSchema(
  Schema.extend(
    BaseCart,
    Schema.Struct({
      items_changelog: Schema.Struct({
        added: Schema.Array(ItemAddedChangelog),
      }),
    }),
  ),
);

export const CartChangeItemOptionalInput = Schema.Struct({
  quantity: Schema.optional(Schema.Number),
  properties: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.NullOr(Schema.String),
    }),
  ),
  selling_plan: Schema.optional(Schema.NullOr(Resource.ID)),
}).pipe(BaseInput);

export const LineItemChange = Schema.Struct({
  product_id: Schema.Number,
  variant_id: Schema.Number,
  id: Schema.String,
  image: Schema.NullOr(Schema.String),
  price: Schema.String,
  presentment_price: Schema.Number,
  quantity: Schema.Number,
  title: Schema.String,
  product_title: Schema.String,
  variant_title: Schema.String,
  vendor: Schema.String,
  product_type: Schema.String,
  sku: Schema.NullOr(Schema.String),
  url: Schema.String,
  untranslated_product_title: Schema.String,
  untranslated_variant_title: Schema.String,
  view_key: Schema.String,
});

export type CartChangeInput = Schema.Schema.Encoded<typeof CartChangeInput>;
export const CartChangeInput = Schema.Union(
  Schema.extend(CartChangeItemOptionalInput)(
    Schema.Struct({
      id: Schema.String,
    }),
  ),
  Schema.extend(CartChangeItemOptionalInput)(
    Schema.Struct({
      line: Schema.Number,
    }),
  ),
);

export type CartChangeOutput = Schema.Schema.Type<typeof CartChangeOutput>;
export const CartChangeOutput = makeCartTransformSchema(
  Schema.extend(
    BaseCart,
    Schema.Struct({
      items_added: Schema.Array(LineItemChange),
      items_removed: Schema.Array(LineItemChange),
    }),
  ),
);

export type CartClearInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartClearInput = Ajax.Sections.Input;

export type CartGetInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartGetInput = Ajax.Sections.Input;

export type CartUpdateDiscountsInput = Schema.Schema.Encoded<
  typeof CartUpdateDiscountsInput
>;
export const CartUpdateDiscountsInput = Schema.mutable(
  Schema.Array(Schema.NonEmptyString),
);
