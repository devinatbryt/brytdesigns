import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";

import {
  ProductInfo,
  ProductOptions,
  ProductOptionGroup,
  ProductVariantInput,
  ProductVariantRender,
} from "./components/index.js";

customShadowlessElement(
  "product-info",
  {
    product: undefined,
    isProductPage: false,
  },
  correctElementType(ProductInfo),
);

customShadowlessElement(
  "product-options",
  {
    selectedOptions: [],
  },
  correctElementType(ProductOptions),
);

customShadowlessElement(
  "product-option-group",
  {
    position: 0,
    name: "",
    inputType: "radio",
  },
  correctElementType(ProductOptionGroup),
);

customShadowlessElement(
  "product-variant-input",
  {
    target: "",
    preventDefault: true,
  },
  correctElementType(ProductVariantInput),
);

customShadowlessElement(
  "product-variant-render",
  {},
  correctElementType(ProductVariantRender),
);

export {
  useProduct,
  useProductOptions,
  getProductContext,
  getProductOptionsContext,
} from "./hooks/index.js";
