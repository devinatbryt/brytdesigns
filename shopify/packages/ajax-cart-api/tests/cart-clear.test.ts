import { describe, it, expect } from "vitest";
import * as Effect from "effect/Effect";
import * as API from "../src/effect";

import { makeMockLayerResponse, defineGlobals } from "./utils";
import { CartClearResponse } from "./responseData/clear";

describe("should return an empty cart response", () => {
  defineGlobals();

  it("should return the a cleared cart", async () => {
    const layer = makeMockLayerResponse(CartClearResponse);

    const program = API.clear().pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart.data?.items).toHaveLength(0);
  });
});
