import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";
import * as API from "./effect/index.js";
import * as AjaxClient from "@brytdesigns/shopify-ajax-client";

export namespace createPredictiveSearchApi {
  export type Options = {
    debug?: boolean;
  };

  export type RequestOptions = {
    signal?: AbortSignal;
    headers?: Record<string, string>;
  };
}

export const createPredicitiveSearchApi = ({ debug = false }) => {
  let baseLayer = Layer.empty;
  let minimumLogLevel = LogLevel.None;
  let loggerLayer = Logger.pretty;

  if (debug) {
    baseLayer = Layer.mergeAll(loggerLayer);
    minimumLogLevel = LogLevel.All;
  }

  const ajaxLayer = Layer.mergeAll(baseLayer, AjaxClient.Default);

  return {
    get: (
      input: API.get.Input,
      options?: createPredictiveSearchApi.RequestOptions,
    ) =>
      Effect.runPromise(
        API.get(input, {
          ...(options || {}),
          headers: {
            "X-SDK-Variant-Source": "shopify-ajax-predictive-search-api",
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
