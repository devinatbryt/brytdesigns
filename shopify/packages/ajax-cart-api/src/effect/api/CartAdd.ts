import { CartAddInput, CartAddOutput } from "../schema.js";

import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export type AddInput = CartAddInput;

/**
 * This function is a factory method for creating a function that adds an item to the cart.
 * It utilizes the provided AjaxClient to make the necessary API request.
 *
 * @param routeName - The name of the route for adding an item to the cart.
 * @param inputSchema - The schema for the input parameters of the cart add API.
 * @param outputSchema - The schema for the output response of the cart add API.
 *
 * @returns A runnable effect that returns a promise which adhears to the outputSchema.
 *
 * @example
 * ```typescript
 * import * as Effect from "effect/Effect"
 * import { make } from "./CartAdd.js";
 *
 * const addItemToCart = make({
 *   routeName: "cart_add_url",
 *   inputSchema: CartAddInput,
 *   outputSchema: CartAddOutput,
 * });
 *
 * const input: CartAddInput = {
 *   items: [
 *    { id: 123, quantity: 2 },
 *    { id: 456, quantity: 1 },
 *   ]
 * };
 *
 *  Effect.runPromise(addItemToCart(input))
 *   .then((output) => {
 *     console.log("Item added to cart:", output?.data);
 *   })
 *   .catch((error) => {
 *     console.error("Failed to add item to cart:", error);
 *   });
 * ```
 */
export const make = AjaxClient.makeFactory({
  routeName: "cart_add_url",
  inputSchema: CartAddInput,
  outputSchema: CartAddOutput,
});
