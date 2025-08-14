import { CartOutput, CartClearInput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type ClearInput = CartClearInput;

/**
 * A factory function to create a clear cart API request using the provided input schema and output schema.
 * This function utilizes the AjaxClient library to make the API request.
 *
 * @param routeName - The name of the route for the clear cart API request.
 * @param inputSchema - The input schema for the clear cart API request.
 * @param outputSchema - The output schema for the clear cart API request.
 *
 * @returns A runnable effect that returns a promise which adhears to the outputSchema.
 *
 * @example
 * ```typescript
 * import * as Effect from "effect/Effect";
 * import { make } from "./CartClear";
 *
 * const clearCart = make({
 *   routeName: "cart_clear_url",
 *   inputSchema: CartClearInput,
 *   outputSchema: CartOutput,
 * });
 *
 * Effect.runPromise(clearCart({})).then((response) => {
 *   console.log(response); // Handle the response
 * }).catch((error) => {
 *   console.error(error); // Handle the error
 * });
 * ```
 */
export const make = AjaxClient.makeFactory({
  routeName: "cart_clear_url",
  inputSchema: CartClearInput,
  outputSchema: CartOutput,
});
