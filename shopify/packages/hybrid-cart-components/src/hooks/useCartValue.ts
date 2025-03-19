import { type Accessor, createMemo } from "solid-js";
import { type ICustomElement } from "component-register";

import { type ValidHybridPath } from "./useFullPropertyPath.js";
import { useHybridCart } from "./useHybridCart.js";
import { getValueFromPath } from "../utils/index.js";

type Options = {
  path: Accessor<ValidHybridPath>;
  element: HTMLElement & ICustomElement;
};

export function useCartValue(options: Options) {
  const cart = useHybridCart(options.element);

  const value = createMemo(() => {
    const c = cart();
    console.log("CART", c);
    if (typeof options.path !== "function") return cart;
    const path = options.path();
    console.log("PATH", path);
    if (!path) return cart;
    const v = getValueFromPath(c, path);
    console.log("VALUE", v);
    if (v === undefined || v === null) return null;
    console.log("VALUE", v);
    return v;
  });

  return value;
}
