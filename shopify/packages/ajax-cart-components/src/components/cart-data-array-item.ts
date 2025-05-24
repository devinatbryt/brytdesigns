import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import {
  type ValidAjaxPath,
  provideFullPropertyPathContext,
  useFullPropertyPath,
} from "../hooks/index.js";

type CartDataArrayItemProps = {
  itemIndex: ValidAjaxPath;
};

export const Name = "cart-data-array-item";

export const Component: CorrectComponentType<CartDataArrayItemProps> = (
  props,
  { element },
) => {
  if (!props.itemIndex)
    return console.warn(`${Name}: No path attribute provided.`);
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
