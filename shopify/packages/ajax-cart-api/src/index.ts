import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";
import * as API from "./effect/index.js";
import * as Schema from "effect/Schema";
import * as AjaxClient from "@brytdesigns/shopify-ajax-client";
import { CartOutput } from "./effect/schema.js";

export namespace createAjaxCartClient {
  export type Options = {
    debug?: boolean;
    // logger?: <Message, Output>(
    //   options: Logger.Logger.Options<Message>
    // ) => Output;
  };

  export type RequestOptions = {
    signal?: AbortSignal;
    headers?: Record<string, string>;
  };
}

/**
 * Validates the input cart object against the defined CartOutput schema.
 *
 * @remarks
 * This function is used to ensure that the provided cart object adheres to the expected structure.
 * It uses the `Effect.runSync` function to decode the unknown cart object using the `Schema.decodeUnknown` function.
 *
 * @param cart - The unknown cart object to be validated.
 * @returns The validated cart object if it matches the CartOutput schema, or throws an error if it doesn't.
 *
 * @example
 * ```typescript
 * const cartData = {
 *   id: "1234567890",
 *   items: [
 *     {
 *       id: "9876543210",
 *       quantity: 2,
 *       variantId: "variant-123",
 *       // ... other item properties
 *     },
 *     // ... other cart items
 *   ],
 *   // ... other cart properties
 * };
 *
 * try {
 *   const validatedCart = validateCart(cartData);
 *   console.log("Cart is valid:", validatedCart);
 * } catch (error) {
 *   console.error("Cart validation failed:", error);
 * }
 * ```
 */ export const validateCart = (cart: unknown) =>
  Effect.runSync(Schema.decodeUnknown(CartOutput)(cart));

/**
 * Creates an instance of the Ajax Cart API client with optional debugging capabilities.
 *
 * @remarks
 * This function initializes the Ajax Cart API client with the provided options.
 * It sets up the necessary layers for logging and AJAX requests based on the debug flag.
 *
 * @param options - An optional object containing debug flag.
 * @param options.debug - A boolean indicating whether to enable debugging. Default is false.
 *
 * @returns An object containing the Ajax Cart API methods: add, change, clear, get, and update.
 *
 * @example
 * ```typescript
 * const ajaxCartApi = createAjaxCartApi({ debug: true });
 *
 * // Use the Ajax Cart API methods
 * ajaxCartApi.add({ productId: "123", quantity: 2 })
 *   .then((response) => {
 *     console.log("Cart updated:", response);
 *   })
 *   .catch((error) => {
 *     console.error("Failed to update cart:", error);
 *   });
 * ```
 */
export const createAjaxCartApi = ({ debug = false }) => {
  let baseLayer = Layer.empty;
  let minimumLogLevel = LogLevel.None;
  let loggerLayer = Logger.pretty;

  if (debug) {
    baseLayer = Layer.mergeAll(loggerLayer);
    minimumLogLevel = LogLevel.All;
  }

  const ajaxLayer = Layer.mergeAll(baseLayer, AjaxClient.Default);

  return {
    /**
     * Adds a product to the cart.
     *
     * @param input - The input object containing the product ID and quantity to be added.
     * @param options - An optional object containing request options.
     * @param options.signal - An AbortSignal object to abort the request.
     * @param options.headers - Custom headers to be sent with the request.
     *
     * @returns A Promise that resolves to the updated cart object.
     *
     * @example
     * ```typescript
     * const ajaxCartApi = createAjaxCartApi({ debug: true });
     *
     * ajaxCartApi.add({ productId: "123", quantity: 2 })
     *   .then((response) => {
     *     console.log("Cart updated:", response);
     *   })
     *   .catch((error) => {
     *     console.error("Failed to update cart:", error);
     *   });
     * ```
     */
    add: (
      input: API.add.Input,
      options?: createAjaxCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.add(input, {
          ...(options || {}),
          headers: {
            "X-SDK-Variant-Source": "shopify-ajax-cart-api",
            ...(options?.headers || {}),
          },
        }).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
    /**
     * Updates the quantity, attributes, or selling plan of a specific item in the cart.
     *
     * @remarks
     * This function sends a request to update the quantity, attributes, or selling plan of a specific item in the cart.
     * It uses the provided input object to specify the item ID and the new quantity, attributes, or selling plan.
     * The function also accepts optional request options, such as an AbortSignal for cancellation.
     *
     * @param input - The input object containing the item ID and the new quantity.
     * @param options - An optional object containing request options.
     * @param options.signal - An AbortSignal object to abort the request.
     * @param options.headers - Custom headers to be sent with the request.
     *
     * @returns A Promise that resolves to the updated cart object.
     *
     * @example
     * ```typescript
     * const ajaxCartApi = createAjaxCartApi({ debug: true });
     *
     * ajaxCartApi.change({ itemId: "9876543210", quantity: 3 })
     *   .then((response) => {
     *     console.log("Cart updated:", response);
     *   })
     *   .catch((error) => {
     *     console.error("Failed to update cart:", error);
     *   });
     * ```
     */
    change: (
      input: API.change.Input,
      options?: createAjaxCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.change(input, {
          ...(options || {}),
          headers: {
            "X-SDK-Variant-Source": "shopify-ajax-cart-api",
            ...(options?.headers || {}),
          },
        }).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
    /**
     * Clears the entire cart.
     *
     * This function sends a request to clear the entire cart. It does not require any input parameters.
     * The function accepts optional request options, such as an AbortSignal for cancellation.
     *
     * @param input - An optional input object containing request options.
     * @param input.signal - An AbortSignal object to abort the request.
     * @param input.headers - Custom headers to be sent with the request.
     *
     * @returns A Promise that resolves to an empty object upon successful cart clearance.
     *
     * @example
     * ```typescript
     * const ajaxCartApi = createAjaxCartApi({ debug: true });
     *
     * ajaxCartApi.clear()
     *   .then(() => {
     *     console.log("Cart cleared successfully");
     *   })
     *   .catch((error) => {
     *     console.error("Failed to clear cart:", error);
     *   });
     * ```
     */
    clear: (
      input: API.clear.Input,
      options?: createAjaxCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.clear(input, {
          ...(options || {}),
          headers: {
            "X-SDK-Variant-Source": "shopify-ajax-cart-api",
            ...(options?.headers || {}),
          },
        }).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
    /**
     * Retrieves the current state of the cart.
     *
     * This function sends a request to retrieve the current state of the cart.
     * It does not require any input parameters.
     * The function accepts optional request options, such as an AbortSignal for cancellation.
     *
     * @param input - An optional input object containing request options.
     * @param input.signal - An AbortSignal object to abort the request.
     * @param input.headers - Custom headers to be sent with the request.
     *
     * @returns A Promise that resolves to the current cart object.
     *
     * @example
     * ```typescript
     * const ajaxCartApi = createAjaxCartApi({ debug: true });
     *
     * ajaxCartApi.get()
     *   .then((response) => {
     *     console.log("Current cart:", response);
     *   })
     *   .catch((error) => {
     *     console.error("Failed to retrieve cart:", error);
     *   });
     * ```
     */
    get: (
      input: API.get.Input,
      options?: createAjaxCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.get(input, {
          ...(options || {}),
          headers: {
            "X-SDK-Variant-Source": "shopify-ajax-cart-api",
            ...(options?.headers || {}),
          },
        }).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
    /**
     * Updates the cart with the provided input data.
     *
     * This function sends a request to update any cart level data (discount codes, notes, attributes, etc...).
     * It uses the provided input object to specify the changes to be made to the cart.
     * The function also accepts optional request options, such as an AbortSignal for cancellation.
     *
     * @param input - The input object containing the changes to be made to the cart.
     * @param options - An optional object containing request options.
     * @param options.signal - An AbortSignal object to abort the request.
     * @param options.headers - Custom headers to be sent with the request.
     *
     * @returns A Promise that resolves to the updated cart object.
     *
     * @example
     * ```typescript
     * const ajaxCartApi = createAjaxCartApi({ debug: true });
     *
     * ajaxCartApi.update({
     *    updates: { 1231231: 2, 1231230: 0 },
     *    note: "This is a note",
     *    attributes: {
     *      "public_key": "Public value",
     *      "_private_key": "Private value"
     *    },
     *    discount: ["hello","world"]
     *  })
     *   .then((response) => {
     *     console.log("Cart updated:", response);
     *   })
     *   .catch((error) => {
     *     console.error("Failed to update cart:", error);
     *   });
     * ```
     */
    update: (
      input: API.update.Input,
      options?: createAjaxCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.update(input, {
          ...(options || {}),
          headers: {
            "X-SDK-Variant-Source": "shopify-ajax-cart-api",
            ...(options?.headers || {}),
          },
        }).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
  };
};
