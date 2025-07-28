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

export const validateCart = (cart: unknown) =>
  Effect.runSync(Schema.decodeUnknown(CartOutput)(cart));

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
    add: (
      input: API.add.Input,
      options?: createAjaxCartClient.RequestOptions,
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
          Effect.provide(ajaxLayer),
        ),
        {
          signal: options?.signal,
        },
      ),
    change: (
      input: API.change.Input,
      options?: createAjaxCartClient.RequestOptions,
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
          Effect.provide(ajaxLayer),
        ),
        {
          signal: options?.signal,
        },
      ),
    clear: (
      input: API.clear.Input,
      options?: createAjaxCartClient.RequestOptions,
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
          Effect.provide(ajaxLayer),
        ),
        {
          signal: options?.signal,
        },
      ),
    get: (
      input: API.get.Input,
      options?: createAjaxCartClient.RequestOptions,
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
          Effect.provide(ajaxLayer),
        ),
        {
          signal: options?.signal,
        },
      ),

    update: (
      input: API.update.Input,
      options?: createAjaxCartClient.RequestOptions,
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
          Effect.provide(ajaxLayer),
        ),
        {
          signal: options?.signal,
        },
      ),
  };
};
