import { CartChangeInput, CartChangeOutput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type ChangeInput = CartChangeInput;

export const make = AjaxClient.makeFactory({
  routeName: "cart_change_url",
  inputSchema: CartChangeInput,
  outputSchema: CartChangeOutput,
});
