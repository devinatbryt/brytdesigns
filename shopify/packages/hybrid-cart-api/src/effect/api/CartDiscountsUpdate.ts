import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { Ajax, Resource } from "@brytdesigns/shopify-utils/effect";

import * as LoggerUtils from "../logger/LoggerUtils.js";
import * as AjaxClientResponse from "../data/AjaxClientResponse.js";
import * as CartGet from "./CartGet.js";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { CartUpdateDiscountsInput } from "../schema.js";

const updateCartDiscountCodesMutation = `#graphql
  mutation updateCartDiscounts($id: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $id, discountCodes: $discountCodes) {
      userErrors {
        field
        message
      }
    }
  }
`;

export type UpdateDiscountsInput = CartUpdateDiscountsInput;

export const make = (discountCodes: CartUpdateDiscountsInput) =>
  Effect.gen(function*() {
    const config = Ajax.Window.StorefrontClientConfig.make();

    const client = createStorefrontApiClient({
      storeDomain: `https://${config.shopName}.myshopify.com`,
      publicAccessToken: config.accessToken,
      apiVersion: config.apiVersion,
    });

    const codes = yield* Schema.decode(CartUpdateDiscountsInput)(discountCodes);

    const initialCart = yield* CartGet.make();

    if (!initialCart.data) {
      if (initialCart.error)
        return AjaxClientResponse.make({
          error: initialCart.error,
        });
      return AjaxClientResponse.make({
        error: {
          status: 404,
          message: "Cart not found",
          description: "Could not find the cart to update the discount codes",
        },
      });
    }

    const id = yield* Resource.format({
      id: initialCart.data.token,
      type: "Cart",
    });

    const response = yield* Effect.tryPromise({
      try: () =>
        client.request(updateCartDiscountCodesMutation, {
          variables: {
            discountCodes: codes,
            id,
          },
        }),
      catch: (error) => {
        if (error instanceof Error) {
          return error;
        }
        return new Error("Failed to update cart discount codes!");
      },
    });

    if (response.errors) {
      return AjaxClientResponse.make({
        error: {
          status: response.errors.networkStatusCode || 500,
          message: response.errors.message || "Unknown error",
          description:
            response.errors.graphQLErrors
              ?.map((error) => error.message)
              .join(", ") || "No errors reported",
        },
      });
    }

    if ((response.data?.cartDiscountCodesUpdate?.userErrors || []).length > 0) {
      return AjaxClientResponse.make({
        error: {
          status: 500,
          message: "Failed to update cart discount codes",
          description:
            response.data?.cartDiscountCodesUpdate?.userErrors
              .map((error: { message: string }) => error.message)
              .join(", ") || "No errors reported",
        },
      });
    }

    return yield* CartGet.make();
  }).pipe(LoggerUtils.withNamespacedLogSpan("discounts.update"));
