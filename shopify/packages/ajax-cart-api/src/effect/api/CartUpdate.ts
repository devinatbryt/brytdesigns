import { CartUpdateInput, CartUpdateOutput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type UpdateInput = CartUpdateInput;

export const make = AjaxClient.makeFactory({
  routeName: "cart_update_url",
  inputSchema: CartUpdateInput,
  outputSchema: CartUpdateOutput,
});
