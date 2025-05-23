import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import {
  type ValidAjaxPath,
  provideFullPropertyPathContext,
  useFullPropertyPath,
} from "../hooks/index.js";

type CartDataArrayItemProps = {
  itemIndex: ValidAjaxPath;
};

export const CartDataArrayItem: CorrectComponentType<CartDataArrayItemProps> = (
  props,
  { element },
) => {
  if (!props.itemIndex)
    return console.warn("cart-data-array-item: No path attribute provided.");
  const mergedProps = {
    element,
    path: () => props.itemIndex,
  };
  const fullPath = useFullPropertyPath(mergedProps);
  provideFullPropertyPathContext({
    element,
    path: fullPath,
  });
};
