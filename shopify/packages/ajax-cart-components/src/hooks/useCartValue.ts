import { type Accessor, createMemo } from "solid-js";
import { type ICustomElement } from "component-register";

import { type ValidAjaxPath } from "./useFullPropertyPath.js";
import { useAjaxCart } from "./useAjaxCart.js";
import { getValueFromPath } from "../utils/index.js";

type Options = {
  path: Accessor<ValidAjaxPath>;
  element: HTMLElement & ICustomElement;
};

export function useCartValue(options: Options) {
  const cart = useAjaxCart(options.element);

  const value = createMemo(() => {
    const c = cart();
    if (typeof options.path !== "function") return c;
    const path = options.path();
    if (!path) return c;
    const v = getValueFromPath(c, path);
    if (v === undefined || v === null) return null;
    return v;
  });

  return value;
}
