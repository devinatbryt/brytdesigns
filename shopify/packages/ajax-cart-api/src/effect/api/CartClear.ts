import { CartOutput, CartClearInput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type ClearInput = CartClearInput;

export const make = AjaxClient.makeFactory({
  routeName: "cart_clear_url",
  inputSchema: CartClearInput,
  outputSchema: CartOutput,
});
