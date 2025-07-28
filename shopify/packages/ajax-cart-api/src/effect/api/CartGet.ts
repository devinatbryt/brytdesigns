import { CartOutput, CartGetInput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type GetInput = CartGetInput;

export const make = AjaxClient.makeFactory({
  routeName: "cart_url",
  inputSchema: CartGetInput,
  outputSchema: CartOutput,
});
