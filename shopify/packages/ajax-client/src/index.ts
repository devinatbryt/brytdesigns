import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Function from "effect/Function";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as BrowserHttpClient from "@effect/platform-browser/BrowserHttpClient";

import { Ajax } from "@brytdesigns/shopify-utils/effect";

import * as LoggerUtils from "./LoggerUtils.js";
import { type CartError, InvalidAjaxMethodError } from "./errors.js";
import * as AjaxClientResponse from "./AjaxClientResponse.js";

const BaseOutputSchema = Schema.Struct({});
const ProductInputSchema = Schema.extend(
  Ajax.Sections.Input,
  Schema.Struct({
    handle: Schema.String,
  }),
);

export const Default = BrowserHttpClient.layerXMLHttpRequest;

const METHOD = {
  GET: "get",
  POST: "post",
};

const METHODS_BY_URL = {
  products_url: METHOD.GET,
  product_url: METHOD.GET,
  predictive_search_url: METHOD.GET,
  product_recommendations_url: METHOD.GET,
  cart_add_url: METHOD.POST,
  cart_update_url: METHOD.POST,
  cart_url: METHOD.GET,
  cart_change_url: METHOD.POST,
  cart_clear_url: METHOD.POST,
};

type ValidAjaxRoutes = keyof Pick<
  Ajax.Window.ShopifyRoutes.ShopifyRoutes,
  | "product_url"
  | "products_url"
  | "predictive_search_url"
  | "product_recommendations_url"
  | "cart_add_url"
  | "cart_update_url"
  | "cart_url"
  | "cart_change_url"
  | "cart_clear_url"
>;

export const makeFactory =
  <
    RouteName extends ValidAjaxRoutes,
    A extends RouteName extends "product_url"
      ? typeof ProductInputSchema.Type
      : typeof Ajax.Sections.Input.Type,
    I,
    R,
    B extends typeof BaseOutputSchema.Type,
    J,
    S,
  >({
    routeName,
    inputSchema,
    outputSchema,
  }: {
    routeName: RouteName;
    inputSchema: Schema.Schema<A, I, R>;
    outputSchema: Schema.Schema<B, J, S>;
  }) =>
  (
    input?: Schema.Schema<A, I, R>["Encoded"],
    options?: { headers?: Record<string, string> },
  ) =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const decodedInput = yield* Schema.decodeUnknown(inputSchema)(
        input || {},
      );
      const routes = Ajax.Window.ShopifyRoutes.make();

      let route: string;

      if (routeName === "product_url" && "handle" in decodedInput) {
        route = routes[routeName].replace(":handle", decodedInput.handle);
      } else {
        route = routes[routeName];
      }

      const url = `${window.location.origin}${route}`;
      const method = METHODS_BY_URL[routeName];

      let request: HttpClientRequest.HttpClientRequest;

      if (method === "post") {
        request = yield* HttpClientRequest.post(url, {
          acceptJson: true,
          headers: {
            "X-SDK-Variant": "brytdesigns",
            "X-SK-Variant-Source": "shopify-ajax-client",
            ...(options?.headers || {}),
          },
        }).pipe(HttpClientRequest.bodyJson(decodedInput));
      } else if (method === "get") {
        request = HttpClientRequest.get(url, {
          acceptJson: true,
          headers: {
            "X-SDK-Variant": "brytdesigns",
            "X-SK-Variant-Source": "shopify-ajax-client",
            ...(options?.headers || {}),
          },
        }).pipe(HttpClientRequest.setUrlParams(decodedInput));
      } else {
        return yield* Effect.fail(new InvalidAjaxMethodError());
      }

      const response = yield* client.execute(request);

      if (response.status !== 200) {
        const data = (yield* response.json) as CartError;
        return AjaxClientResponse.make({
          error: {
            description: data.description,
            status: data.status,
            message: data.message,
          },
        });
      }

      if (decodedInput.sections) {
        const output = outputSchema.pipe(
          Schema.extend(
            Schema.Struct({
              sections: Ajax.Sections.makeResponseSchema(decodedInput.sections),
            }),
          ),
        );

        const json = yield* Function.pipe(
          response,
          HttpClientResponse.schemaBodyJson(output),
        );

        const clientResponse = AjaxClientResponse.make({
          data: json,
        });

        yield* Effect.annotateLogsScoped({
          method,
          route,
          input: decodedInput,
          output: clientResponse,
        });

        return clientResponse;
      }

      const output = outputSchema;

      const json = yield* Function.pipe(
        response,
        HttpClientResponse.schemaBodyJson(output),
      );

      const clientResponse = AjaxClientResponse.make({
        data: json,
      });

      yield* Effect.annotateLogsScoped({
        method,
        route,
        input: decodedInput,
        output: clientResponse,
      });

      yield* Effect.logInfo("Request");

      return clientResponse;
    }).pipe(
      Effect.scoped,
      LoggerUtils.withNamespacedLogSpan(
        routeName.replace("_url", "").replace("_", ":"),
      ),
      Effect.catchAll((error) => {
        if (
          error._tag === "ParseError" ||
          error._tag === "RequestError" ||
          error._tag === "ResponseError" ||
          error._tag === "@brytdesigns/ajax-client/InvalidAjaxMethodError"
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
    );
