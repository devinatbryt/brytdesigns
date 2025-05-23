import { describe, it, expect } from "vitest";
import * as Effect from "effect/Effect";

import * as API from "../src/effect";

import { makeMockLayerResponse, defineGlobals } from "./utils";

import { OneItemResponse, MultipleItemResponse } from "./responseData/add";

describe("add item/items to cart responses", async () => {
  defineGlobals();

  it("should return a single item", async () => {
    const layer = makeMockLayerResponse(OneItemResponse);

    const program = API.add({
      sections: "main-product,review-section",
      items: [
        {
          id: 44632334565593,
          quantity: 1,
        },
      ],
    }).pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart.data?.items).toHaveLength(1);
    expect(cart.data?.items?.at(0)?.id).toEqual(
      OneItemResponse.items.at(0)?.id,
    );
  });

  it("should return multiple items", async () => {
    const layer = makeMockLayerResponse(MultipleItemResponse);

    const program = API.add({
      items: [
        {
          id: 44632334565593,
          quantity: 1,
        },
        {
          id: 44632334598361,
          quantity: 1,
        },
      ],
    }).pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart.data?.items).toHaveLength(2);
    cart.data?.items?.forEach((item, index) => {
      const matchingItem = MultipleItemResponse.items.at(index);
      return expect(item.id).toEqual(matchingItem?.id);
    });
  });
});
