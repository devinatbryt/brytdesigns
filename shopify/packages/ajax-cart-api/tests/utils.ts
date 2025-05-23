import * as Layer from "effect/Layer";
import * as Effect from "effect/Effect";
import * as HttpClient from "@effect/platform/HttpClient";
import * as HttpClientResponse from "@effect/platform/HttpClientResponse";
import * as Logger from "effect/Logger";
import * as AjaxRequest from "../src/effect/services/AjaxRequest";

import { vi } from "vitest";

export const makeMockLayerResponse = (data: any) =>
  Layer.mergeAll(
    Logger.pretty,
    AjaxRequest.Default,
    Layer.succeed(
      HttpClient.HttpClient,
      HttpClient.make((req) =>
        Effect.succeed(
          HttpClientResponse.fromWeb(
            req,
            new Response(JSON.stringify(data), {
              status: 200,
            }),
          ),
        ),
      ),
    ),
  );

export const defineGlobals = () =>
  vi.stubGlobal("window", {
    location: {
      origin: "https://example.com",
    },
    Shopify: {
      storefront: {
        config: {
          shopName: process.env.SHOPIFY_PUBLIC_STORE_NAME,
          apiVersion: process.env.SHOPIFY_PUBLIC_STOREFRONT_VERSION,
          accessToken: process.env.SHOPIFY_PUBLIC_STOREFRONT_TOKEN,
        },
      },
    },
  });
