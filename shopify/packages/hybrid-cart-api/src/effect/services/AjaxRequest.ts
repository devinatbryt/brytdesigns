import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Function from "effect/Function";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as HttpClientRequest from "@effect/platform/HttpClientRequest";
import * as FetchHttpClient from "@effect/platform/FetchHttpClient";

import { Ajax } from "@brytdesigns/shopify-utils/effect";

import * as LoggerUtils from "../logger/LoggerUtils.js";
import { CartError, InvalidAjaxMethodError } from "../errors.js";
import { AjaxClientResponse } from "../data/index.js";

const BaseOutputSchema = Schema.Struct({});

export const Default = FetchHttpClient.layer;

export const makeFactory =
  <
    A extends typeof Ajax.Sections.Input.Type,
    I,
    R,
    B extends typeof BaseOutputSchema.Type,
    J,
    S,
  >({
    inputSchema,
    routeName,
    method,
    outputSchema,
  }: {
    method: keyof Pick<typeof HttpClientRequest, "post" | "get">;
    routeName: keyof Pick<
      Ajax.Window.ShopifyRoutes.ShopifyRoutes,
      | "cart_add_url"
      | "cart_update_url"
      | "cart_url"
      | "cart_change_url"
      | "cart_clear_url"
    >;
    inputSchema: Schema.Schema<A, I, R>;
    outputSchema: Schema.Schema<B, J, S>;
  }) =>
  (input?: Schema.Schema<A, I, R>["Encoded"]) =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const decodedInput = yield* Schema.decodeUnknown(inputSchema)(
        input || {}
      );
      const routes = Ajax.Window.ShopifyRoutes.make();
      const route = routes[routeName];
      const url = `${window.location.origin}${route}`;

      let request: HttpClientRequest.HttpClientRequest;

      if (method === "post") {
        request = yield* HttpClientRequest.post(url, {
          acceptJson: true,
        }).pipe(HttpClientRequest.bodyJson(decodedInput));
      } else if (method === "get") {
        request = HttpClientRequest.get(url, {
          acceptJson: true,
        }).pipe(HttpClientRequest.setUrlParams(decodedInput));
      } else {
        return yield* Effect.fail(new InvalidAjaxMethodError());
      }

      const response = yield* client.execute(request);

      if (response.status !== 200) {
        const data = (yield* response.json) as CartError;
        return AjaxClientResponse.make({
          error: new CartError(data),
        });
      }

      if (decodedInput.sections) {
        const output = outputSchema.pipe(
          Schema.extend(
            Schema.Struct({
              sections: Ajax.Sections.makeResponseSchema(decodedInput.sections),
            })
          )
        );

        const json = yield* Function.pipe(
          response,
          HttpClientResponse.schemaBodyJson(output)
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
      }

      const output = outputSchema.pipe(
        Schema.extend(
          Schema.Struct({
            sections: Schema.optionalWith(Schema.Null, { default: () => null }),
          })
        )
      );

      const json = yield* Function.pipe(
        response,
        HttpClientResponse.schemaBodyJson(output)
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
        routeName.replace("_url", "").replace("_", ":")
      )
    );
