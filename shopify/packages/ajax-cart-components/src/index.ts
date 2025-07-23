import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";

import {
  CartContext,
  CartData,
  CartDataArray,
  CartDataArrayInjection,
  CartDataArrayItem,
  CartDataConditions,
  CartDataInjection,
  CartDataListener,
  CartDataListenerStatus,
  CartLoadingState,
} from "./components/index.js";

customShadowlessElement(
  CartContext.Name,
  { debug: false },
  correctElementType(CartContext.Component),
);

customShadowlessElement(
  CartDataArrayItem.Name,
  //@ts-ignore
  { itemIndex: "0" },
  correctElementType(CartDataArrayItem.Component),
);

customShadowlessElement(
  CartDataArray.Name,
  {
    format: "",
    arrayPath: "items",
    reverse: false,
  },
  correctElementType(CartDataArray.Component),
);

customShadowlessElement(
  CartDataArrayInjection.Name,
  {
    format: "",
    arrayPath: "items",
    target: "",
    wrapInnerChild: true,
    reverse: false,
  },
  correctElementType(CartDataArrayInjection.Component),
);

customShadowlessElement(
  CartData.Name,
  {
    format: "",
    propertyName: "item_count",
  },
  correctElementType(CartData.Component),
);

customShadowlessElement(
  CartDataConditions.Name,
  {},
  correctElementType(CartDataConditions.Component),
);

customShadowlessElement(
  CartDataInjection.Name,
  {
    propertyName: "item_count",
    attributeName: "data-item-count",
    injectionType: "attribute",
    target: "",
    format: "",
  },
  correctElementType(CartDataInjection.Component),
);

customShadowlessElement(
  CartDataListener.Name,
  {
    status: "default",
    on: "submit",
    method: "updateItem",
    resetForm: true,
    debounceDelay: 0,
    resetStatusDelay: 0,
    preventDefault: true,
  },
  correctElementType(CartDataListener.Component),
);

customShadowlessElement(
  CartDataListenerStatus.Name,
  {},
  correctElementType(CartDataListenerStatus.Component),
);

customShadowlessElement(
  CartLoadingState.Name,
  { ignoredStates: [] },
  correctElementType(CartLoadingState.Component),
);

export * from "./hooks/index.js";
