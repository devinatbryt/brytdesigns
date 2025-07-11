import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";

import {
  ProductInfo,
  ProductOptions,
  ProductOptionGroup,
  ProductVariantInput,
  ProductVariantRender,
} from "./components/index.js";

customShadowlessElement(
  ProductInfo.Name,
  {
    product: undefined,
    isProductPage: false,
  },
  correctElementType(ProductInfo.Component),
);

customShadowlessElement(
  ProductOptions.Name,
  {
    selectedOptions: [],
  },
  correctElementType(ProductOptions.Component),
);

customShadowlessElement(
  ProductOptionGroup.Name,
  {
    position: 0,
    name: "",
    inputType: "radio",
  },
  correctElementType(ProductOptionGroup.Component),
);

customShadowlessElement(
  ProductVariantInput.Name,
  {
    target: "",
    preventDefault: true,
  },
  correctElementType(ProductVariantInput.Component),
);

customShadowlessElement(
  ProductVariantRender.Name,
  {},
  correctElementType(ProductVariantRender.Component),
);

export {
  useProduct,
  useProductOptions,
  getProductContext,
  getProductOptionsContext,
  withProductElementContext,
  withProductOptionsElementContext,
} from "./hooks/index.js";
