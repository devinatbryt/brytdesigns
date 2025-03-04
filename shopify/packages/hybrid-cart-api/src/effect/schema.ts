import * as Resource from "@repo/shopify-utils/effect/Resource";
import * as AjaxSections from "@repo/shopify-utils/effect/Ajax/Sections";
import * as Schema from "effect/Schema";

export type BaseAttributes = Schema.Schema.Type<typeof BaseAttributes>;
export const BaseAttributes = Schema.Record({
  key: Schema.String,
  value: Schema.Union(
    Schema.Null,
    Schema.String,
    Schema.Boolean,
    Schema.Number,
  ),
});

export const SplitAttributes = Schema.Struct({
  private: BaseAttributes,
  public: BaseAttributes,
});

export const Attributes = Schema.transform(BaseAttributes, SplitAttributes, {
  decode(attrs) {
    const entries = Object.entries(attrs);
    return {
      private: entries.reduce((attr, [key, value]) => {
        if (!key.startsWith("_")) return attr;
        return { ...attr, [key.substring(1)]: value };
      }, {}),
      public: entries.reduce((attr, [key, value]) => {
        if (key.startsWith("_")) return attr;
        return { ...attr, [key]: value };
      }, {}),
    };
  },
  encode(attrs) {
    return {
      ...attrs.private,
      ...attrs.public,
    };
  },
});

export type DiscountApplication = Schema.Schema.Type<
  typeof DiscountApplication
>;

export const DiscountApplication = Schema.Struct({
  target_selection: Schema.Literal("all", "entitled", "explicit"),
  target_type: Schema.Literal("line_item", "shipping_line"),
  title: Schema.NonEmptyString,
  total_allocated_amount: Schema.Number,
  type: Schema.Literal("automatic", "discount_code", "manual", "script"),
  value: Schema.NumberFromString,
  value_type: Schema.Literal("fixed_amount", "percentage"),
});

export const Discount = Schema.Struct({
  amount: Schema.Number,
  title: Schema.String,
});

export type CurrencyCode = Schema.Schema.Type<typeof CurrencyCode>;
export const CurrencyCode = Schema.String;

export type Image = Schema.Schema.Type<typeof Image>;
export const Image = Schema.Struct({
  aspect_ratio: Schema.Number,
  alt: Schema.String,
  height: Schema.Number,
  url: Schema.URL,
  width: Schema.Number,
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
  value: Schema.Number,
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

export type LineItem = Schema.Schema.Type<typeof LineItem>;
export const LineItem = Schema.Struct({
  id: Resource.ID,
  properties: Schema.optionalWith(Schema.NullOr(Attributes), {
    default: () => ({
      private: {},
      public: {},
    }),
  }),
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
  featured_image: Schema.optional(Image),
  image: Schema.URL,
  handle: Schema.String,
  requires_shipping: Schema.Boolean,
  product_type: Schema.String,
  product_title: Schema.String,
  product_description: Schema.String,
  variant_title: Schema.NullOr(Schema.String),
  variant_options: Schema.Array(Schema.String),
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

export const Cart = Schema.Struct({
  token: Schema.String,
  note: Schema.NullOr(Schema.String),
  attributes: Schema.optionalWith(Attributes, {
    default: () => ({
      private: {},
      public: {},
    }),
  }),
  original_total_price: Schema.Number,
  total_price: Schema.Number,
  total_discount: Schema.Number,
  total_weight: Schema.Number,
  item_count: Schema.Number,
  items: Schema.Array(LineItem),
  requires_shipping: Schema.Boolean,
  currency: CurrencyCode,
  items_subtotal_price: Schema.Number,
  cart_level_discount_applications: Schema.Array(DiscountApplication),
});

export const makeCartSchema = (sections?: string) => {
  if (sections) {
    return Schema.Struct({
      ...Cart.fields,
      sections: Schema.optionalWith(
        Schema.NullOr(AjaxSections.makeResponseSchema(sections)),
        { default: () => null },
      ),
    });
  }
  return Schema.Struct({
    ...Cart.fields,
    sections: Schema.optionalWith(Schema.Null, { default: () => null }),
  });
};

export type AddItemInput = Schema.Schema.Encoded<typeof AddItemInput>;
export const AddItemInput = Schema.Struct({
  id: Resource.ID,
  quantity: Schema.optionalWith(Schema.Number, { default: () => 1 }),
  properties: Schema.optionalWith(BaseAttributes, { default: () => ({}) }),
  selling_plan: Schema.optional(Resource.ID),
});

export const BaseInput = Schema.extend(AjaxSections.Input);

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

export type CartUpdateInput = Schema.Schema.Encoded<typeof CartUpdateInput>;
export const CartUpdateInput = Schema.Struct({
  updates: Schema.optional(
    Schema.Union(UpdateItemRecordInput, Schema.Array(Schema.Number)),
  ),
  note: Schema.optional(Schema.NullOr(Schema.String)),
  attributes: Schema.optional(Attributes),
}).pipe(BaseInput);

export type ItemAddedChangelog = Schema.Schema.Type<typeof ItemAddedChangelog>;
export const ItemAddedChangelog = Schema.Struct({
  variant_id: Schema.Number,
  quantity: Schema.Number,
});

export type CartUpdateOutput = Schema.Schema.Type<typeof CartUpdateOutput>;
export const CartUpdateOutput = Schema.Struct({
  ...Cart.fields,
  items_changelog: Schema.Struct({
    added: Schema.Array(ItemAddedChangelog),
  }),
});

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
  image: Schema.URL,
  price: Schema.String,
  presentment_price: Schema.Number,
  quantity: Schema.Number,
  title: Schema.String,
  product_title: Schema.String,
  variant_title: Schema.String,
  vendor: Schema.String,
  product_type: Schema.String,
  sku: Schema.String,
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
export const CartChangeOutput = Schema.Struct({
  ...Cart.fields,
  items_added: Schema.Array(LineItemChange),
  items_removed: Schema.Array(LineItemChange),
});

export type CartClearInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartClearInput = AjaxSections.Input;

export type CartGetInput = Schema.Schema.Encoded<typeof CartClearInput>;
export const CartGetInput = AjaxSections.Input;

export type CartUpdateDiscountsInput = Schema.Schema.Encoded<
  typeof CartUpdateDiscountsInput
>;
export const CartUpdateDiscountsInput = Schema.mutable(
  Schema.Array(Schema.NonEmptyString),
);
