import { CartAddInput, CartAddOutput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type AddInput = CartAddInput;

export const make = AjaxClient.makeFactory({
  routeName: "cart_add_url",
  inputSchema: CartAddInput,
  outputSchema: CartAddOutput,
});
