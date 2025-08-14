import { CartUpdateInput, CartUpdateOutput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type UpdateInput = CartUpdateInput;

/**
 * Factory function to create a new instance of CartUpdate API.
 * This function is used to update the cart with the provided input data.
 *
 * @param routeName - The name of the route for the CartUpdate API.
 * @param inputSchema - The input schema for the CartUpdate API.
 * @param outputSchema - The output schema for the CartUpdate API.
 *
 * @returns A runnable effect that returns a promise which adhears to the CartUpdateOutput schema.
 *
 * @example
 * ```typescript
 * import * as Effect from "effect/Effect";
 * import {make} from "./CartUpdate.js";
 *
 * const cartUpdateRequest = make({
 *   routeName: "cart_update_url",
 *   inputSchema: CartUpdateInput,
 *   outputSchema: CartUpdateOutput,
 * });
 *
 * const updatedCart = await Effect.runPromise(cartUpdateRequest({
 *   updates: {
 *     // variant id
 *     123413523: 1
 *   },
 *   discount: ["hello"]
 *   note: "New note for the cart",
 *   attributes: {
 *     "custom_attribute": "new value"
 *   }
 * }));
 * ```
 */
export const make = AjaxClient.makeFactory({
  routeName: "cart_update_url",
  inputSchema: CartUpdateInput,
  outputSchema: CartUpdateOutput,
});
