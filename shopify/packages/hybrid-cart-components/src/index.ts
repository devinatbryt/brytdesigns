import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";

import {
  CartContext,
  CartData,
  CartDataArray,
  CartDataArrayItem,
  CartDataConditions,
  CartDataInjection,
  CartDataListener,
  CartDataListenerStatus,
  CartLoadingState,
} from "./components/index.js";

customShadowlessElement(
  "cart-context",
  { debug: false },
  correctElementType(CartContext),
);

customShadowlessElement(
  "cart-data-array-item",
  //@ts-ignore
  { itemIndex: "0" },
  correctElementType(CartDataArrayItem),
);

customShadowlessElement(
  "cart-data-array",
  {
    format: "",
    arrayPath: "items",
  },
  correctElementType(CartDataArray),
);

customShadowlessElement(
  "cart-data",
  {
    format: "",
    propertyName: "item_count",
  },
  correctElementType(CartData),
);

customShadowlessElement(
  "cart-data-conditions",
  {},
  correctElementType(CartDataConditions),
);

customShadowlessElement(
  "cart-data-injection",
  {
    propertyName: "item_count",
    attributeName: "data-item-count",
    injectionType: "attribute",
    target: "",
    format: "",
  },
  correctElementType(CartDataInjection),
);

customShadowlessElement(
  "cart-data-listener",
  {
    status: "default",
    on: "submit",
    method: "updateItem",
    resetForm: true,
    debounceDelay: 0,
    resetStatusDelay: 0,
    preventDefault: true,
  },
  correctElementType(CartDataListener),
);

customShadowlessElement(
  "cart-data-listener-status",
  {},
  correctElementType(CartDataListenerStatus),
);

customShadowlessElement(
  "cart-loading-state",
  { ignoredStates: [] },
  correctElementType(CartLoadingState),
);

export * from "./hooks/index.js";
