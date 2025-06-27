import type { CartData } from "./types";

import { observable } from "solid-js";

import { Cart } from "./query/index.js";

export const uniq = (array: string[]): string[] => Array.from(new Set(array));

export const getNormalizedAttributes = () => {
  const cart = Cart.get();
  const mergedAttributes = {
    ...cart.attributes,
  };
  return mergedAttributes;
};

export const getCartDiscountCodes = () => {
  const cart = Cart.get();
  const cartLevelCodes = (cart?.cart_level_discount_applications || [])
    .filter((discount) => discount.type === "discount_code")
    .map((discount) => discount.title);

  const itemLevelCodes = (cart?.items || [])?.reduce((codes, item) => {
    const itemCodes = (item?.line_level_discount_allocations || [])
      .filter(
        (allocation) =>
          allocation.discount_application.type === "discount_code",
      )
      .map((allocation) => allocation.discount_application.title);
    return uniq([...codes, ...itemCodes]);
  }, [] as string[]);

  return uniq([...cartLevelCodes, ...itemLevelCodes]);
};

function defaultUnwrap<T>(cart: CartData): T {
  return cart as T; // Use unknown as intermediary to satisfy TypeScript
}

export function subscribe<T>(
  unwrapValue: (cart: CartData) => T = defaultUnwrap,
  cb: (data: T) => void,
): () => void {
  // Assuming cartQuery and observable are defined and set correctly.
  const observer = observable(() => unwrapValue(Cart.query.data));
  return observer.subscribe(cb).unsubscribe;
}
