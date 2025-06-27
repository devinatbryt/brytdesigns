import { CartOutput, CartClearInput } from "../schema.js";

import * as AjaxRequest from "../services/AjaxRequest.js";

export type ClearInput = CartClearInput;

export const make = AjaxRequest.makeFactory({
  routeName: "cart_clear_url",
  method: "post",
  inputSchema: CartClearInput,
  outputSchema: CartOutput,
});
