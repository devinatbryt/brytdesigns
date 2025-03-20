import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import {
  type ValidHybridPath,
  provideFullPropertyPathContext,
} from "../hooks/index.js";
import { createEffect } from "solid-js";

type CartDataArrayItemProps = {
  path: ValidHybridPath;
};

export const CartDataArrayItem: CorrectComponentType<CartDataArrayItemProps> = (
  props,
  { element }
) => {
  if (!props.path)
    return console.warn("cart-data-array-item: No path attribute provided.");
  const mergedProps = {
    element,
    path: () => props.path,
  };
  const fullPath = provideFullPropertyPathContext(mergedProps);
  createEffect(() => {
    console.log(element, fullPath());
  });
};
