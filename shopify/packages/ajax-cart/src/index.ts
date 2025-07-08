import type { CartData } from "./types";

import { mergeProps } from "solid-js";

import { Cart } from "./query/index.js";
import {
  AddItems,
  RemoveItems,
  UpdateAttributes,
  UpdateDiscounts,
  UpdateItem,
  UpdateNote,
  ClearCart,
  ReplaceItem,
} from "./mutations/index.js";
import {
  getNormalizedAttributes,
  subscribe,
  getCartDiscountCodes,
  uniq,
} from "./utils.js";

const AjaxCart = mergeProps(Cart.query, {
  addItems: AddItems.mutation.mutateAsync,
  addItem: (input: AddItems.Input) => AddItems.mutation.mutateAsync([input]),
  removeItems: RemoveItems.mutation.mutateAsync,
  removeItem(input: RemoveItems.Input) {
    return RemoveItems.mutation.mutateAsync([input]);
  },
  addAttributes(input: UpdateAttributes.Input) {
    const mergedAttributes = getNormalizedAttributes();
    return UpdateAttributes.mutation.mutateAsync({
      ...mergedAttributes,
      ...input,
    });
  },
  addAttribute(input: { key: string; value: UpdateAttributes.Input[string] }) {
    const mergedAttributes = getNormalizedAttributes();
    return UpdateAttributes.mutation.mutateAsync({
      ...mergedAttributes,
      [input.key]: input.value,
    });
  },
  updateAttributes: UpdateAttributes.mutation.mutateAsync,
  removeAttributes(input: string[]) {
    const mergedAttributes = getNormalizedAttributes();
    return UpdateAttributes.mutation.mutateAsync({
      ...mergedAttributes,
      ...Object.fromEntries(input.map((key) => [key, null])),
    });
  },
  removeAttribute(key: string) {
    const mergedAttributes = getNormalizedAttributes();
    return UpdateAttributes.mutation.mutateAsync({
      ...mergedAttributes,
      [key]: null,
    });
  },
  updateNote: UpdateNote.mutation.mutateAsync,
  clear: ClearCart.mutation.mutateAsync,
  updateItem: UpdateItem.mutation.mutateAsync,
  async updateItems(input: UpdateItem.Input[]) {
    const results = await Promise.allSettled(
      input.map((i) => UpdateItem.mutation.mutateAsync(i)),
    );
    return {
      rejected: results.filter((r) => r.status === "rejected"),
      resolved: results.filter((r) => r.status === "fulfilled"),
    };
  },
  addDiscounts(input: UpdateDiscounts.Input[]) {
    const codes = getCartDiscountCodes();
    return UpdateDiscounts.mutation.mutateAsync(uniq([...codes, ...input]));
  },
  addDiscount(input: UpdateDiscounts.Input) {
    const codes = getCartDiscountCodes();
    return UpdateDiscounts.mutation.mutateAsync(uniq([...codes, input]));
  },
  removeDiscounts(input: UpdateDiscounts.Input[]) {
    const codes = getCartDiscountCodes();
    return UpdateDiscounts.mutation.mutateAsync(
      codes.filter((code) => !input.includes(code)),
    );
  },
  removeDiscount(input: UpdateDiscounts.Input) {
    const codes = getCartDiscountCodes();
    return UpdateDiscounts.mutation.mutateAsync(
      codes.filter((code) => code !== input),
    );
  },
  replaceItem(input: ReplaceItem.Input) {
    return ReplaceItem.mutation.mutateAsync(input);
  },
  async replaceItems(input: ReplaceItem.Input[]) {
    const results = await Promise.allSettled(
      input.map((i) => ReplaceItem.mutation.mutateAsync(i)),
    );
    return {
      rejected: results.filter((r) => r.status === "rejected"),
      resolved: results.filter((r) => r.status === "fulfilled"),
    };
  },
  subscribe,
});

const oldFetch = window.fetch;

// Override any mutation based fetch calls to the cart to ensure our cart state is always up to date.
window.fetch = async function (...args: Parameters<typeof fetch>) {
  let [input, options] = args;
  let route: string;
  if (window.BrytDesigns.debug) {
    console.log("Fetch", ...args);
  }
  if (input instanceof Request) route = input.url;
  else if (input instanceof URL) route = input.toString();
  else if (typeof input === "string") route = input;
  else route = "";
  if (!route.startsWith("/cart/")) return oldFetch(...args);

  if (input instanceof Request && !options) {
    options = {
      headers: input.headers,
    };
  }

  if (
    options &&
    options.headers &&
    "x-sdk-variant" in options.headers &&
    options.headers["x-sdk-variant"] === "brytdesigns"
  )
    return oldFetch(...args);
  Cart.cancel();
  return oldFetch(...args).finally(() => Cart.invalidate());
};

declare global {
  interface Window {
    BrytDesigns: {
      initialCart: CartData;
      cart: typeof AjaxCart;
      debug?: boolean;
    };
  }
}

//@ts-ignore
if (!window.BrytDesigns) window.BrytDesigns = {};
window.BrytDesigns.cart = AjaxCart;

export default AjaxCart;
