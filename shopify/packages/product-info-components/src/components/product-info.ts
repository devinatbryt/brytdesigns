import type { CorrectComponentType } from "@brytdesigns/web-component-utils";
import { provideProductContext } from "../hooks/index.js";

import type { Product } from "../types.js";

type ProductInfoProps = {
  product?: Product;
};

export const ProductInfo: CorrectComponentType<ProductInfoProps> = (
  props,
  { element },
) => {
  if (!props.product)
    return console.warn("product-info: product attribute is required");
  if (!props.product.variants)
    return console.warn("product-info: product attribute needs variants array");
  if (!props.product.selected_or_first_available_variant)
    return console.warn(
      "product-info: product attribute needs selected or first available variant object",
    );
  provideProductContext(
    {
      get product() {
        return props.product!;
      },
      element,
    },
    element,
  );
};
