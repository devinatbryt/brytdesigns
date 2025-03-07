import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";
import * as API from "./effect/index.js";
import * as AjaxRequest from "./effect/services/AjaxRequest.js";

export namespace createHybridCartClient {
  export type Options = {
    logger?: Parameters<typeof Logger.make>[0];
  };

  export type RequestOptions = {
    signal?: AbortSignal;
  };
}

export const createHybridCartApi = ({
  logger,
}: createHybridCartClient.Options = {}) => {
  let baseLayer = Layer.empty;
  let minimumLogLevel = LogLevel.None;
  let loggerLayer = Logger.pretty;

  if (logger) {
    loggerLayer = Logger.replace(Logger.defaultLogger, Logger.make(logger));
    baseLayer = Layer.mergeAll(loggerLayer);
    minimumLogLevel = LogLevel.All;
  }

  const ajaxLayer = Layer.mergeAll(baseLayer, AjaxRequest.Default);

  return {
    add: (
      input: API.add.Input,
      options?: createHybridCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.add(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
    change: (
      input: API.change.Input,
      options?: createHybridCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.change(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),
    clear: (
      input: API.clear.Input,
      options?: createHybridCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.clear(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),

    get: (
      input: API.get.Input,
      options?: createHybridCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.get(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),

    update: (
      input: API.update.Input,
      options?: createHybridCartClient.RequestOptions
    ) =>
      Effect.runPromise(
        API.update(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer)
        ),
        {
          signal: options?.signal,
        }
      ),

    discounts: {
      update: (
        input: API.discounts.update["Input"],
        options?: createHybridCartClient.RequestOptions
      ) =>
        Effect.runPromise(
          API.discounts
            .update(input)
            .pipe(
              Logger.withMinimumLogLevel(minimumLogLevel),
              Effect.provide(baseLayer)
            ),
          {
            signal: options?.signal,
          }
        ),
    },
  };
};
