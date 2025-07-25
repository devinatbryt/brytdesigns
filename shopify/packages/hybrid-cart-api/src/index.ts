import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";
import * as API from "./effect/index.js";
import * as AjaxRequest from "./effect/services/AjaxRequest.js";

export namespace createHybridCartClient {
  export type Options = {
    debug?: boolean;
    // logger?: <Message, Output>(
    //   options: Logger.Logger.Options<Message>
    // ) => Output;
  };

  export type RequestOptions = {
    signal?: AbortSignal;
  };
}

export const createHybridCartApi = ({ debug = false }) => {
  let baseLayer = Layer.empty;
  let minimumLogLevel = LogLevel.None;
  let loggerLayer = Logger.pretty;

  if (debug) {
    baseLayer = Layer.mergeAll(loggerLayer);
    minimumLogLevel = LogLevel.All;
  }

  // if (logger) {
  //   loggerLayer = Logger.replace(Logger.defaultLogger, Logger.make(logger));
  //   baseLayer = Layer.mergeAll(loggerLayer);
  //   minimumLogLevel = LogLevel.All;
  // }

  const ajaxLayer = Layer.mergeAll(baseLayer, AjaxRequest.Default);

  return {
    add: (
      input: API.add.Input,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.add(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer),
          Effect.catchAll((error) => {
            if (
              error._tag === "ParseError" ||
              error._tag === "RequestError" ||
              error._tag === "ResponseError" ||
              error._tag ===
                "@brytdesigns/hybrid-cart-client/InvalidAjaxMethodError"
            ) {
              return Effect.fail(
                new Error(error.message, {
                  cause: error.cause,
                }),
              );
            }
            if (error._tag === "HttpBodyError") {
              const reason = error.reason;
              if (reason._tag === "JsonError") {
                return Effect.fail(new Error("Failed to parse JSON response"));
              }
              if (reason._tag === "SchemaError") {
                return Effect.fail(
                  new Error(reason.error.message, {
                    cause: reason.error.cause,
                  }),
                );
              }
            }
            return Effect.fail(new Error(error.toString()));
          }),
        ),
        {
          signal: options?.signal,
        },
      ),
    change: (
      input: API.change.Input,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.change(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer),
          Effect.catchAll((error) => {
            if (
              error._tag === "ParseError" ||
              error._tag === "RequestError" ||
              error._tag === "ResponseError" ||
              error._tag ===
                "@brytdesigns/hybrid-cart-client/InvalidAjaxMethodError"
            ) {
              return Effect.fail(
                new Error(error.message, {
                  cause: error.cause,
                }),
              );
            }
            if (error._tag === "HttpBodyError") {
              const reason = error.reason;
              if (reason._tag === "JsonError") {
                return Effect.fail(new Error("Failed to parse JSON response"));
              }
              if (reason._tag === "SchemaError") {
                return Effect.fail(
                  new Error(reason.error.message, {
                    cause: reason.error.cause,
                  }),
                );
              }
            }
            return Effect.fail(new Error(error.toString()));
          }),
        ),
        {
          signal: options?.signal,
        },
      ),
    clear: (
      input: API.clear.Input,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.clear(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer),
          Effect.catchAll((error) => {
            if (
              error._tag === "ParseError" ||
              error._tag === "RequestError" ||
              error._tag === "ResponseError" ||
              error._tag ===
                "@brytdesigns/hybrid-cart-client/InvalidAjaxMethodError"
            ) {
              return Effect.fail(
                new Error(error.message, {
                  cause: error.cause,
                }),
              );
            }
            if (error._tag === "HttpBodyError") {
              const reason = error.reason;
              if (reason._tag === "JsonError") {
                return Effect.fail(new Error("Failed to parse JSON response"));
              }
              if (reason._tag === "SchemaError") {
                return Effect.fail(
                  new Error(reason.error.message, {
                    cause: reason.error.cause,
                  }),
                );
              }
            }
            return Effect.fail(new Error(error.toString()));
          }),
        ),
        {
          signal: options?.signal,
        },
      ),

    get: (
      input: API.get.Input,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.get(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer),
          Effect.catchAll((error) => {
            if (
              error._tag === "ParseError" ||
              error._tag === "RequestError" ||
              error._tag === "ResponseError" ||
              error._tag ===
                "@brytdesigns/hybrid-cart-client/InvalidAjaxMethodError"
            ) {
              return Effect.fail(
                new Error(error.message, {
                  cause: error.cause,
                }),
              );
            }
            if (error._tag === "HttpBodyError") {
              const reason = error.reason;
              if (reason._tag === "JsonError") {
                return Effect.fail(new Error("Failed to parse JSON response"));
              }
              if (reason._tag === "SchemaError") {
                return Effect.fail(
                  new Error(reason.error.message, {
                    cause: reason.error.cause,
                  }),
                );
              }
            }
            return Effect.fail(new Error(error.toString()));
          }),
        ),
        {
          signal: options?.signal,
        },
      ),

    update: (
      input: API.update.Input,
      options?: createHybridCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.update(input).pipe(
          Logger.withMinimumLogLevel(minimumLogLevel),
          Effect.provide(ajaxLayer),
          Effect.catchAll((error) => {
            if (
              error._tag === "ParseError" ||
              error._tag === "RequestError" ||
              error._tag === "ResponseError" ||
              error._tag ===
                "@brytdesigns/hybrid-cart-client/InvalidAjaxMethodError"
            ) {
              return Effect.fail(
                new Error(error.message, {
                  cause: error.cause,
                }),
              );
            }
            if (error._tag === "HttpBodyError") {
              const reason = error.reason;
              if (reason._tag === "JsonError") {
                return Effect.fail(new Error("Failed to parse JSON response"));
              }
              if (reason._tag === "SchemaError") {
                return Effect.fail(
                  new Error(reason.error.message, {
                    cause: reason.error.cause,
                  }),
                );
              }
            }
            return Effect.fail(new Error(error.toString()));
          }),
        ),
        {
          signal: options?.signal,
        },
      ),

    discounts: {
      update: (
        input: API.discounts.update["Input"],
        options?: createHybridCartClient.RequestOptions,
      ) =>
        Effect.runPromise(
          API.discounts.update(input).pipe(
            Logger.withMinimumLogLevel(minimumLogLevel),
            Effect.provide(ajaxLayer),
            Effect.catchAll((error) => {
              if (!("_tag" in error) && error instanceof Error) {
                return Effect.fail(error);
              }
              if (
                error._tag === "ParseError" ||
                error._tag === "RequestError" ||
                error._tag === "ResponseError"
              ) {
                return Effect.fail(
                  new Error(error.message, {
                    cause: error.cause,
                  }),
                );
              }
              if (error._tag === "HttpBodyError") {
                const reason = error.reason;
                if (reason._tag === "JsonError") {
                  return Effect.fail(
                    new Error("Failed to parse JSON response"),
                  );
                }
                if (reason._tag === "SchemaError") {
                  return Effect.fail(
                    new Error(reason.error.message, {
                      cause: reason.error.cause,
                    }),
                  );
                }
              }
              return Effect.fail(new Error(error.toString()));
            }),
          ),
          {
            signal: options?.signal,
          },
        ),
    },
  };
};
