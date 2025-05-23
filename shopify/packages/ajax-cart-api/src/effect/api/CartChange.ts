import { CartChangeInput, CartChangeOutput } from "../schema.js";

import * as AjaxRequest from "../services/AjaxRequest.js";

export type ChangeInput = CartChangeInput;

export const make = AjaxRequest.makeFactory({
  routeName: "cart_change_url",
  method: "post",
  inputSchema: CartChangeInput,
  outputSchema: CartChangeOutput,
});
