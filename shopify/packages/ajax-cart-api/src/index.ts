import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as Layer from "effect/Layer";
import * as LogLevel from "effect/LogLevel";
import * as API from "./effect/index.js";
import * as AjaxRequest from "./effect/services/AjaxRequest.js";
import * as Schema from "effect/Schema";
import { AjaxClientResponse } from "./effect/data/index.js";
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

  // if (logger) {
  //   loggerLayer = Logger.replace(Logger.defaultLogger, Logger.make(logger));
  //   baseLayer = Layer.mergeAll(loggerLayer);
  //   minimumLogLevel = LogLevel.All;
  // }

  const ajaxLayer = Layer.mergeAll(baseLayer, AjaxRequest.Default);

  return {
    add: (
      input: API.add.Input,
      options?: createAjaxCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.add(input, options).pipe(
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
      options?: createAjaxCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.change(input, options).pipe(
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
      options?: createAjaxCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.clear(input, options).pipe(
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
      options?: createAjaxCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.get(input, options).pipe(
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
      options?: createAjaxCartClient.RequestOptions,
    ) =>
      Effect.runPromise(
        API.update(input, options).pipe(
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
              return Effect.succeed(
                AjaxClientResponse.make({
                  error: {
                    status: 400,
                    message: error.message,
                    description: "Something went wrong",
                  },
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
  };
};
