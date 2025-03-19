import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import { createEffect, on } from "solid-js";
import { provideHybridCartContext } from "../hooks/useHybridCart.js";

type CartContextProps = {
  debug?: boolean;
};

export const CartContext: CorrectComponentType<CartContextProps> = (
  props,
  { element },
) => {
  const cart = provideHybridCartContext(element);
  createEffect(
    on(
      () => ({
        cart: cart(),
        debug: props.debug,
      }),
      ({ cart, debug }) => {
        if (!debug) return;
        console.log("Cart updated:", cart);
      },
    ),
  );
};
