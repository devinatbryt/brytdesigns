import { CartOutput, CartGetInput } from "../schema.js";

import * as AjaxRequest from "../services/AjaxRequest.js";

export type GetInput = CartGetInput;

export const make = AjaxRequest.makeFactory({
  routeName: "cart_url",
  method: "get",
  inputSchema: CartGetInput,
  outputSchema: CartOutput,
});
