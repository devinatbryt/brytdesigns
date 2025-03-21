import type {
  StorefrontQueries,
  StorefrontMutations,
} from "@solidifront/storefront-client/effect";

import type { Types } from "effect";

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as StorefrontClient from "@solidifront/storefront-client/effect";

import { Ajax, Resource } from "@brytdesigns/shopify-utils/effect";

import * as LoggerUtils from "../logger/LoggerUtils.js";
import * as AjaxClientResponse from "../data/AjaxClientResponse.js";
import * as CartGet from "./CartGet.js";
import { CartUpdateDiscountsInput } from "../schema.js";

export type ExtractOperationNameError = Types.ExtractTag<
  Effect.Effect.Error<
    ReturnType<
      Effect.Effect.Success<ReturnType<typeof StorefrontClient.make>>["query"]
    >
  >,
  "ExtractOperationNameError"
>;

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
  Effect.gen(function* () {
    const config = Ajax.Window.StorefrontClientConfig.make();

    const client = yield* StorefrontClient.make<
      StorefrontQueries,
      StorefrontMutations
    >({
      storeName: config.shopName,
      publicAccessToken: config.accessToken,
      apiVersion: config.apiVersion as any,
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

    const response = yield* client.mutate(updateCartDiscountCodesMutation, {
      variables: {
        discountCodes: codes,
        id,
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
              .map((error) => error.message)
              .join(", ") || "No errors reported",
        },
      });
    }

    return yield* CartGet.make();
  }).pipe(
    LoggerUtils.withNamespacedLogSpan("discounts.update"),
    Effect.provide(StorefrontClient.Default),
  );
