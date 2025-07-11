import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import { createEffect, on } from "solid-js";
import { provideAjaxCartContext } from "../hooks/useAjaxCart.js";
import { traverseObject } from "../utils/index.js";

type CartContextProps = {
  debug?: boolean;
};

export const Name = "cart-context";

export const Component: CorrectComponentType<CartContextProps> = (
  props,
  { element },
) => {
  const cart = provideAjaxCartContext(element);
  createEffect(
    on(
      () => {
        const c = cart();
        // This will listen to every change within the cart object.
        traverseObject(c);
        return {
          cart: c,
          debug: props.debug,
        };
      },
      ({ cart, debug }) => {
        if (!debug) return;
        console.log(`${Name}:updated!`, cart);
      },
    ),
  );
};
