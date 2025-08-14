import { CartChangeInput, CartChangeOutput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type ChangeInput = CartChangeInput;

/**
 * Factory function to create a new instance of CartChange API.
 * This function is used to make requests to the Shopify API for changing properties of an individual cart item.
 *
 * @param routeName - The name of the route for the CartChange API.
 * @param inputSchema - The input schema for the CartChange API.
 * @param outputSchema - The output schema for the CartChange API.
 *
 * @returns A runnable effect that returns a promise which adhears to the CartChangeOutput schema.
 *
 * @example
 * ```typescript
 * import * as Effect from "effect/Effect"
 * import { make } from "./CartChange.js";
 *
 * const cartChangeRequest = make({
 *   routeName: "cart_change_url",
 *   inputSchema: CartChangeInput,
 *   outputSchema: CartChangeOutput,
 * });
 *
 * const response = await Effect.runPromise(cartChangeRequest({
 *   line: 1,
 *   quantity: 2
 * }));
 *
 *  const response = await Effect.runPromise(cartChangeRequest({
 *   // variant id
 *   id: 1230311313,
 *   quantity: 2
 *  }));
 *
 *  const response = await Effect.runPromise(cartChangeRequest({
 *   // item key
 *   id: "q23asdl234lk241:1230311313",
 *   quantity: 2
 *  }));
 *
 *  const response = await Effect.runPromise(cartChangeRequest({
 *   // item key
 *   id: "q23asdl234lk241:1230311313",
 *   properties: {
 *     size: "Large"
 *   }
 *  }));
 * ```
 */
export const make = AjaxClient.makeFactory({
  routeName: "cart_change_url",
  inputSchema: CartChangeInput,
  outputSchema: CartChangeOutput,
});
