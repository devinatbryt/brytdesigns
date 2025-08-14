import { CartOutput, CartGetInput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type GetInput = CartGetInput;

/**
 * This function is a factory method for creating a function that retrieves the current cart from the Shopify store.
 * It utilizes the provided AjaxClient to make the API request.
 *
 * @param routeName - The name of the route for the cart API endpoint.
 * @param inputSchema - The input schema for the cart retrieval request.
 * @param outputSchema - The output schema for the cart retrieval response.
 *
 * @returns A runnable effect that returns a promise which adhears to the CartGetOutput schema.
 *
 * @example
 * ```typescript
 * import * as Effect from "effect/Effect";
 * import { make } from "./CartGet";
 *
 * const getCart = make({
 *   routeName: "cart_url",
 *   inputSchema: CartGetInput,
 *   outputSchema: CartOutput,
 * });
 *
 * Effect.runPromise(getCart({})).then((response) => {
 *   console.log(response.data);
 * });
 * ```
 */
export const make = AjaxClient.makeFactory({
  routeName: "cart_url",
  inputSchema: CartGetInput,
  outputSchema: CartOutput,
});
