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
  Schema.Number
).annotations({
  title: "base_attribute_value",
  identifier: "BaseAttributeValue",
  description:
    "An attribute value that can be either a string, a boolean, or a number",
  examples: [null, "hello", true, 123131],
});

const AttributesArray = Schema.Array(
  Schema.Struct({ key: Schema.String, value: BaseAttributeValue })
).annotations({
  title: "base_attributes_array",
  identifier: "BaseAttributesArray",
  description: "An array of attribute key-value pairs",
  examples: [
    [{ key: "size", value: "medium" }],
    [{ key: "color", value: "red" }],
  ],
});

export type BaseAttributes = Schema.Schema.Type<typeof BaseAttributes>;
export const BaseAttributes = Schema.Record({
  key: Schema.String,
  value: BaseAttributeValue,
}).annotations({
  title: "base_attributes",
  identifier: "BaseAttributes",
  description: "An object containing attribute key-value pairs",
  examples: [
    { key: "size", value: "medium" },
    { key: "color", value: "red" },
  ],
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
          Array.map(({ key, value }) => [key, value])
        )
      ),
  }
).annotations({
  title: "base_attributes_array",
  identifier: "BaseAttributesArray",
  description: "An array of attribute key-value pairs",
  examples: [
    [{ key: "size", value: "medium" }],
    [{ key: "color", value: "red" }],
  ],
});

const BasePrivateAttributes = Schema.transform(BaseAttributes, BaseAttributes, {
  decode: Record.filter((_, key) => key.startsWith("_")),
  encode: identity,
}).annotations({
  title: "base_private_attributes",
  identifier: "BasePrivateAttributes",
  description: "An object containing private(_) attribute key-value pairs",
  examples: [{ _key: "private_attribute" }],
});

const BasePublicAttributes = Schema.transform(BaseAttributes, BaseAttributes, {
  decode: Record.filter((_, key) => !key.startsWith("_")),
  encode: identity,
}).annotations({
  title: "base_public_attributes",
  identifier: "BasePublicAttributes",
  description: "An object containing public attribute key-value pairs",
  examples: [{ key: "public_attribute" }],
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
          Array.map(({ key, value }) => [key, value])
        )
      ),
  }
).annotations({
  title: "base_private_attributes_array",
  identifier: "BasePrivateAttributesArray",
  description: "An array of private(_)_attribute key-value pairs",
  examples: [[{ key: "_private_key", value: "private_value" }]],
});

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
          Array.map(({ key, value }) => [key, value])
        )
      ),
  }
).annotations({
  title: "base_public_attributes_array",
  identifier: "BasePublicAttributesArray",
  description: "An array of public attribute key-value pairs",
  examples: [[{ key: "public_key", value: "public_value" }]],
});

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
  }
).annotations({
  title: "attributes",
  identifier: "Attributes",
  description:
    "An object containing private and public properties which contain the array and record of private and public attribute key-value pairs",
  examples: [
    {
      private: {
        array: [{ key: "_size", value: "medium" }],
        record: { _size: "medium" },
      },
      public: {
        array: [{ key: "public_size", value: "large" }],
        record: { public_size: "large" },
      },
    },
  ],
});

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
}).annotations({
  title: "discount_application",
  identifier: "DiscountApplication",
  description: "An object representing a discount application",
  examples: [
    {
      target_selection: "all",
      target_type: "line_item",
      title: "10% off all line items",
      total_allocated_amount: 10,
      type: "automatic",
      value_type: "percentage",
      value: 10,
      description: null,
    },
  ],
});

export const Discount = Schema.Struct({
  amount: Schema.Number,
  title: Schema.String,
}).annotations({
  title: "discount",
  identifier: "Discount",
  description: "An object representing a discount",
  examples: [{ amount: 10, title: "10% off" }],
});

export type CurrencyCode = Schema.Schema.Type<typeof CurrencyCode>;
export const CurrencyCode = Schema.String.annotations({
  title: "currency_code",
  identifier: "CurrencyCode",
  description: "An ISO 4217 currency code",
  examples: ["USD", "EUR", "GBP"],
});

export type Image = Schema.Schema.Type<typeof Image>;
export const Image = Schema.Struct({
  aspect_ratio: Schema.NullOr(Schema.Number),
  alt: Schema.NullOr(Schema.String),
  height: Schema.NullOr(Schema.Number),
  url: Schema.NullOr(Schema.String),
  width: Schema.NullOr(Schema.Number),
}).annotations({
  title: "image",
  identifier: "Image",
  description: "An object representing an image",
  examples: [
    {
      url: "https://example.com/image.jpg",
      alt: "Example image",
      height: 100,
      width: 100,
      aspect_ratio: 1,
    },
    {
      url: null,
      alt: null,
      height: null,
      width: null,
      aspect_ratio: null,
    },
  ],
});

export type OptionWithValue = Schema.Schema.Type<typeof OptionWithValue>;
export const OptionWithValue = Schema.Struct({
  name: Schema.String,
  value: Schema.String,
}).annotations({
  title: "option_with_value",
  identifier: "OptionWithValue",
  description: "An object representing an option with a value",
  examples: [{ name: "Size", value: "Large" }],
});

export type QuantityRule = Schema.Schema.Type<typeof QuantityRule>;
export const QuantityRule = Schema.Struct({
  min: Schema.Number,
  max: Schema.NullOr(Schema.Number),
  increment: Schema.Number,
}).annotations({
  title: "quantity_rule",
  identifier: "QuantityRule",
  description: "An object representing a quantity rule",
  examples: [{ min: 1, max: 5, increment: 1 }],
});

export type SellingPlanAllocationPriceAdjustment = Schema.Schema.Type<
  typeof SellingPlanAllocationPriceAdjustment
>;
export const SellingPlanAllocationPriceAdjustment = Schema.Struct({
  position: Schema.Number,
  price: Schema.Number,
}).annotations({
  title: "selling_plan_allocation_price_adjustment",
  identifier: "SellingPlanAllocationPriceAdjustment",
  description:
    "An object representing a selling plan allocation price adjustment",
  examples: [{ position: 1, price: 10.0 }],
});

export const SellingPlanPriceAdjustment = Schema.Struct({
  order_count: Schema.NullOr(Schema.Number),
  position: Schema.Number,
  value: Schema.Union(Schema.Number, Schema.String),
  value_type: Schema.Literal("percentage", "fixed_amount", "price"),
}).annotations({
  title: "selling_plan_price_adjustment",
  identifier: "SellingPlanPriceAdjustment",
  description: "An object representing a selling plan price adjustment",
  examples: [
    { order_count: null, position: 1, value: 10.0, value_type: "percentage" },
  ],
});

export type SellingPlanOption = Schema.Schema.Type<typeof SellingPlanOption>;
export const SellingPlanOption = Schema.Struct({
  name: Schema.String,
  position: Schema.Number,
  value: Schema.String,
}).annotations({
  title: "selling_plan_option",
  identifier: "SellingPlanOption",
  description: "An object representing a selling plan option",
  examples: [{ name: "Size", position: 1, value: "Large" }],
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
}).annotations({
  title: "selling_plan",
  identifier: "SellingPlan",
  description: "An object representing a selling plan",
  examples: [
    {
      id: "sp-123",
      name: "Standard Plan",
      description: "A basic selling plan",
      options: [{ name: "Size", position: 1, value: "Large" }],
      recurring_deliveries: false,
      fixed_selling_plan: false,
      price_adjustments: [],
    },
  ],
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
}).annotations({
  title: "selling_plan_allocation",
  identifier: "SellingPlanAllocation",
  description: "An object representing a selling plan allocation",
  examples: [
    {
      price_adjustments: [],
      price: 10.0,
      compare_at_price: 15.0,
      per_delivery_price: 10.0,
      selling_plan: {
        id: "sp-123",
        name: "Standard Plan",
        description: "A basic selling plan",
        options: [{ name: "Size", position: 1, value: "Large" }],
        recurring_deliveries: false,
        fixed_selling_plan: false,
        price_adjustments: [],
      },
    },
  ],
});

export type LineLevelDiscountAllocation = Schema.Schema.Type<
  typeof LineLevelDiscountAllocation
>;
export const LineLevelDiscountAllocation = Schema.Struct({
  amount: Schema.Number,
  discount_application: DiscountApplication,
}).annotations({
  title: "line_level_discount_allocation",
  identifier: "LineLevelDiscountAllocation",
  description: "An object representing a line level discount allocation",
  examples: [
    {
      amount: 10.0,
      discount_application: {
        target_selection: "all",
        target_type: "line_item",
        title: "10% off all line items",
        total_allocated_amount: 10,
        type: "automatic",
        value_type: "percentage",
        value: 10,
        description: null,
      },
    },
  ],
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
  }
).annotations({
  title: "cart_level_discount_application",
  identifier: "CartLevelDiscountApplication",
  description: "An object representing a cart level discount application",
  examples: [
    {
      target_selection: "all",
      target_type: "line_item",
      title: "10% off all line items",
      total_allocated_amount: 10,
      type: "automatic",
      value_type: "percentage",
      value: 10,
      description: null,
    },
  ],
});

export const CartLevelDiscountApplication = Schema.Union(
  DiscountApplication,
  CartLevelDiscountApplicationUpdate
).annotations({
  title: "cart_level_discount_application",
  identifier: "CartLevelDiscountApplication",
  description: "An object representing a cart level discount application",
  examples: [
    {
      target_selection: "all",
      target_type: "line_item",
      title: "10% off all line items",
      total_allocated_amount: 10,
      type: "automatic",
      value_type: "percentage",
      value: 10,
      description: null,
    },
  ],
});

export type UnitPriceMeasurement = Schema.Schema.Type<
  typeof UnitPriceMeasurement
>;
export const UnitPriceMeasurement = Schema.Struct({
  measured_type: Schema.Literal("volume", "weight", "dimension"),
  quantity_unit: Schema.String,
  quantity_value: Schema.Number,
  reference_unit: Schema.String,
  reference_value: Schema.Number,
}).annotations({
  title: "unit_price_measurement",
  identifier: "UnitPriceMeasurement",
  description: "An object representing a unit price measurement",
  examples: [
    {
      measured_type: "volume",
      quantity_unit: "gallons",
      quantity_value: 1,
      reference_unit: "ounces",
      reference_value: 128,
    },
  ],
});

const VariantOptions = Schema.optionalWith(Schema.Array(Schema.String), {
  default: () => [],
}).annotations({
  title: "variant_options",
  identifier: "VariantOptions",
  description: "An array of strings representing variant options",
  examples: [["Red", "Size 10"]],
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
    { default: () => null }
  ),
}).annotations({
  identifier: "BaseLineItem",
  title: "base_line_item",
  description: "An object representing the base cart line item",
  examples: [
    {
      id: 103424255,
      properties: {
        Size: "Large",
        _hidden: "value",
      },
      quantity: 1,
      variant_id: 103424256,
      key: "2klj234ljlkjsdlf:103424255",
      title: "Black T-Shirt",
      price: 29.99,
      original_price: 39.99,
      discounted_price: 29.99,
      line_price: 29.99,
      original_line_price: 39.99,
      total_discount: 0,
      discounts: [],
      sku: "SKU-12345",
      grams: 100,
      vendor: "Vendor Name",
      taxable: true,
      product_id: 12345,
      product_has_only_default_variant: true,
      gift_card: false,
      final_line_price: 29.99,
      final_price: 29.99,
      url: "https://example.com/products/black-t-shirt?variant=103424256",
      featured_image: {
        alt: "Black T-Shirt",
        url: "https://example.com/black-t-shirt.jpg",
        width: 600,
        height: 400,
        aspect_ratio: 1.5,
      },
      image: "https://example.com/black-t-shirt.jpg",
      handle: "black-t-shirt",
      requires_shipping: true,
      product_type: "t-shirt",
      product_title: "Black T-Shirt",
      product_description: "A stylish and comfortable t-shirt.",
      variant_title: "Large",
      variant_options: ["Large"],
      options_with_values: [],
      line_level_discount_allocations: [],
      line_level_total_discount: 0,
      quantity_rule: {
        min: 1,
        max: null,
        increment: 1,
      },
      has_components: false,
      unit_price: 29.99,
      unit_price_measurement: {
        measured_type: "volume",
        quantity_unit: "gallons",
        quantity_value: 1,
        reference_unit: "ounces",
        reference_value: 128,
      },
      selling_plan_allocation: null,
    },
  ],
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
        }
      ),
      public_properties: Schema.optionalWith(BasePublicAttributes, {
        default: () => ({}),
      }),
      public_properties_array: Schema.optionalWith(BasePublicAttributesArray, {
        default: () => [],
      }),
    })
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
        Record.remove("public_properties_array")
      ) as BaseLineItem,
  }
).annotations({
  identifier: "LineItem",
  title: "line_item",
  description: "An object representing a cart line item",
  examples: [
    {
      id: 103424255,
      properties: {
        Size: "Large",
        _hidden: "value",
      },
      properties_array: [
        { key: "Size", value: "Large" },
        { key: "_hidden", value: "value" },
      ],
      private_properties: {
        _hidden: "value",
      },
      private_properties_array: [{ key: "_hidden", value: "value" }],
      public_properties: {
        Size: "Large",
      },
      public_properties_array: [{ key: "Size", value: "Large" }],
      quantity: 1,
      variant_id: 103424256,
      key: "2klj234ljlkjsdlf:103424255",
      title: "Black T-Shirt",
      price: 29.99,
      original_price: 39.99,
      discounted_price: 29.99,
      line_price: 29.99,
      original_line_price: 39.99,
      total_discount: 0,
      discounts: [],
      sku: "SKU-12345",
      grams: 100,
      vendor: "Vendor Name",
      taxable: true,
      product_id: 12345,
      product_has_only_default_variant: true,
      gift_card: false,
      final_line_price: 29.99,
      final_price: 29.99,
      url: "https://example.com/products/black-t-shirt?variant=103424256",
      featured_image: {
        alt: "Black T-Shirt",
        url: "https://example.com/black-t-shirt.jpg",
        width: 600,
        height: 400,
        aspect_ratio: 1.5,
      },
      image: "https://example.com/black-t-shirt.jpg",
      handle: "black-t-shirt",
      requires_shipping: true,
      product_type: "t-shirt",
      product_title: "Black T-Shirt",
      product_description: "A stylish and comfortable t-shirt.",
      variant_title: "Large",
      variant_options: ["Large"],
      options_with_values: [],
      line_level_discount_allocations: [],
      line_level_total_discount: 0,
      quantity_rule: {
        min: 1,
        max: null,
        increment: 1,
      },
      has_components: false,
      unit_price: 29.99,
      unit_price_measurement: {
        measured_type: "volume",
        quantity_unit: "gallons",
        quantity_value: 1,
        reference_unit: "ounces",
        reference_value: 128,
      },
      selling_plan_allocation: null,
    },
  ],
});

type BaseCart = Schema.Schema.Type<typeof BaseCart>;
export const BaseCart = Schema.Struct({
  token: Schema.String,
  note: Schema.NullOr(Schema.String),
  attributes: BaseAttributes,
  discounts: Schema.optionalWith(Schema.Array(Discount), { default: () => [] }),
  discount_codes: Schema.optionalWith(
    Schema.Array(
      Schema.Struct({ code: Schema.String, applicable: Schema.Boolean })
    ),
    { default: () => [] }
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
}).annotations({
  identifier: "BaseCart",
  title: "base_cart",
  description: "An object representing the base cart",
  examples: [
    {
      token: "2lk34j2lk34kljl09sdfksldfk",
      note: "This is a note",
      attributes: {
        public: "value",
        _private: "value2",
      },
      discounts: [],
      discount_codes: [],
      original_total_price: 99.99,
      total_price: 99.99,
      total_discount: 0,
      total_weight: 100,
      item_count: 1,
      items: [],
      requires_shipping: true,
      currency: "USD",
      items_subtotal_price: 99.99,
      cart_level_discount_applications: [],
    },
  ],
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
  })
).annotations({
  identifier: "Cart",
  title: "cart",
  description: "An object representing a cart",
  examples: [
    {
      token: "2lk34j2lk34kljl09sdfksldfk",
      note: "This is a note",
      attributes: {
        public: "value",
        _private: "value2",
      },
      attributes_array: [
        { key: "public", value: "value" },
        { key: "_private", value: "value2" },
      ],
      private_attributes: { _private: "value2" },
      private_attributes_array: [{ key: "_private", value: "value2" }],
      public_attributes: { public: "value" },
      public_attributes_array: [{ key: "public", value: "value" }],
      discounts: [],
      discount_codes: [],
      original_total_price: 99.99,
      total_price: 99.99,
      total_discount: 0,
      total_weight: 100,
      item_count: 1,
      items: [],
      requires_shipping: true,
      currency: "USD",
      items_subtotal_price: 99.99,
      cart_level_discount_applications: [],
    },
  ],
});

export const makeCartTransformSchema = <
  A extends Schema.Schema.Type<typeof BaseCart>,
  I,
  R,
>(
  schema: Schema.Schema<A, I, R>
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
        Record.remove("public_attributes_array")
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
            { default: () => null }
          ),
        })
      )
    );
  }
  return makeCartTransformSchema(
    Schema.extend(
      BaseCart,
      Schema.Struct({
        sections: Schema.optionalWith(Schema.Null, { default: () => null }),
      })
    )
  );
};

export type AddItemInput = Schema.Schema.Encoded<typeof AddItemInput>;
export const AddItemInput = Schema.Struct({
  id: Resource.ID,
  quantity: Schema.optionalWith(Schema.Number, { default: () => 1 }),
  properties: Schema.optionalWith(BaseAttributes, { default: () => ({}) }),
  selling_plan: Schema.optional(Resource.ID),
}).annotations({
  identifier: "AddItemInput",
  title: "add_item_input",
  description:
    "An object representing the input for adding an item to the cart",
  examples: [
    {
      id: "1234567890",
      quantity: 1,
      properties: {
        public: "value",
        _private: "value2",
      },
      selling_plan: "sp1234567890",
    },
  ],
});

export const BaseInput = Schema.extend(Ajax.Sections.Input);

export type CartAddInput = Schema.Schema.Encoded<typeof CartAddInput>;
export const CartAddInput = Schema.Struct({
  items: Schema.Array(AddItemInput),
})
  .pipe(BaseInput)
  .annotations({
    identifier: "CartAddInput",
    title: "cart_add_input",
    description:
      "An object representing the input for adding items to the cart",
    examples: [
      {
        items: [
          {
            id: "1234567890",
            quantity: 1,
            properties: {
              public: "value",
              _private: "value2",
            },
            selling_plan: "sp1234567890",
          },
        ],
      },
    ],
  });

export type CartAddOutput = Schema.Schema.Type<typeof CartAddOutput>;
export const CartAddOutput = Schema.Struct({
  items: Schema.Array(LineItem),
}).annotations({
  identifier: "CartAddOutput",
  title: "cart_add_output",
  description: "An object representing the output for adding items to the cart",
});

export type UpdateItemRecordInput = Schema.Schema.Encoded<
  typeof UpdateItemRecordInput
>;
export const UpdateItemRecordInput = Schema.Record({
  key: Schema.String,
  value: Schema.Number,
}).annotations({
  identifier: "UpdateItemRecordInput",
  title: "update_item_record_input",
  description: "An object representing the input for updating an item record",
  examples: [
    {
      11231233132: 2,
      1115235234242: 0,
    },
  ],
});

const DiscountCodeInput = Schema.Array(Schema.String);
const DiscountCodeTransformed = Schema.String;

export type CartUpdateInput = Schema.Schema.Encoded<typeof CartUpdateInput>;
export const CartUpdateInput = Schema.Struct({
  updates: Schema.optional(
    Schema.Union(UpdateItemRecordInput, Schema.Array(Schema.Number))
  ),
  note: Schema.optional(Schema.NullOr(Schema.String)),
  attributes: Schema.optional(BaseAttributes),
  discount: Schema.optional(
    Schema.transform(DiscountCodeInput, DiscountCodeTransformed, {
      decode: (input) => input.join(","),
      encode: (input) => input.split(","),
    })
  ),
})
  .pipe(BaseInput)
  .annotations({
    identifier: "CartUpdateInput",
    title: "cart_update_input",
    description: "An object representing the input for updating the cart",
    examples: [
      {
        updates: {
          11231233132: 2,
          1115235234242: 0,
        },
        note: "Updated note",
        attributes: {
          public: "updated",
          _private: "updated2",
        },
        discount: "code1,code2",
      },
    ],
  });

export type ItemAddedChangelog = Schema.Schema.Type<typeof ItemAddedChangelog>;
export const ItemAddedChangelog = Schema.Struct({
  variant_id: Schema.Number,
  quantity: Schema.Number,
}).annotations({
  identifier: "ItemAddedChangelog",
  title: "item_added_changelog",
  description: "An object representing the item added to the cart",
  examples: [
    {
      variant_id: 123,
      quantity: 1,
    },
  ],
});

export type CartUpdateOutput = Schema.Schema.Type<typeof CartUpdateOutput>;
export const CartUpdateOutput = makeCartTransformSchema(
  Schema.extend(
    BaseCart,
    Schema.Struct({
      items_changelog: Schema.Struct({
        added: Schema.Array(ItemAddedChangelog),
      }),
    })
  )
).annotations({
  identifier: "CartUpdateOutput",
  title: "cart_update_output",
  description: "An object representing the output for updating the cart",
});

export const CartChangeItemOptionalInput = Schema.Struct({
  quantity: Schema.optional(Schema.Number),
  properties: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.NullOr(Schema.String),
    })
  ),
  selling_plan: Schema.optional(Schema.NullOr(Resource.ID)),
})
  .pipe(BaseInput)
  .annotations({
    identifier: "CartChangeItemOptionalInput",
    title: "cart_change_item_optional_input",
    description:
      "An object representing optional input for changing an item in the cart",
    examples: [
      {
        quantity: 1,
        properties: {
          key: "property_key",
          value: "property_value",
        },
        selling_plan: "sp1234567890",
      },
      {
        quantity: 1,
        properties: {
          key: "property_key",
          value: "property_value",
        },
        selling_plan: "sp1234567890",
      },
    ],
  });

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
}).annotations({
  identifier: "LineItemChange",
  title: "line_item_change",
  description: "An object representing a change in a line item in the cart",
});

export type CartChangeInput = Schema.Schema.Encoded<typeof CartChangeInput>;
export const CartChangeInput = Schema.Union(
  Schema.extend(CartChangeItemOptionalInput)(
    Schema.Struct({
      id: Schema.String,
    })
  ),
  Schema.extend(CartChangeItemOptionalInput)(
    Schema.Struct({
      line: Schema.Number,
    })
  )
).annotations({
  identifier: "CartChangeInput",
  title: "cart_change_input",
  description:
    "An object representing the input for changing an item in the cart",
  examples: [
    {
      id: "1234567890",
      quantity: 1,
      properties: {
        key: "property_key",
        value: "property_value",
      },
      selling_plan: "sp1234567890",
    },
    {
      line: 1,
      quantity: 1,
      properties: {
        key: "property_key",
        value: "property_value",
      },
      selling_plan: "sp1234567890",
    },
  ],
});

export type CartChangeOutput = Schema.Schema.Type<typeof CartChangeOutput>;
export const CartChangeOutput = makeCartTransformSchema(
  Schema.extend(
    BaseCart,
    Schema.Struct({
      items_added: Schema.Array(LineItemChange),
      items_removed: Schema.Array(LineItemChange),
    })
  )
).annotations({
  identifier: "CartChangeOutput",
  title: "cart_change_output",
  description:
    "An object representing the output for changing an item in the cart",
});

export type CartClearInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartClearInput = Ajax.Sections.Input.annotations({
  identifier: "CartClearInput",
  title: "cart_clear_input",
  description: "An object representing the input for clearing the cart",
  examples: [{}, { sections: "cart_drawer,cart_section" }],
});

export type CartGetInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartGetInput = Ajax.Sections.Input.annotations({
  identifier: "CartGetInput",
  title: "cart_get_input",
  description: "An object representing the input for getting the cart",
  examples: [{}, { sections: "cart_drawer,cart_section" }],
});

export type CartUpdateDiscountsInput = Schema.Schema.Encoded<
  typeof CartUpdateDiscountsInput
>;
export const CartUpdateDiscountsInput = Schema.mutable(
  Schema.Array(Schema.NonEmptyString)
);
