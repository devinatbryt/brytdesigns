import { describe, it, expect } from "vitest";
import * as Effect from "effect/Effect";
import * as API from "../src/effect";

import { makeMockLayerResponse, defineGlobals } from "./utils";

import { CartResponse } from "./responseData/get";

describe("should return full cart response", () => {
  defineGlobals();

  it("should return the entire cart", async () => {
    const layer = makeMockLayerResponse(CartResponse);

    const program = API.get().pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart.data?.items).toHaveLength(1);
    expect(cart.data?.items?.at(0)?.id).toEqual(CartResponse.items.at(0)?.id);
  });
});
