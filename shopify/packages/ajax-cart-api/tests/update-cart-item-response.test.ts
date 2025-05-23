import { describe, it, expect } from "vitest";
import * as Effect from "effect/Effect";
import * as API from "../src/effect";

import { defineGlobals, makeMockLayerResponse } from "./utils";
import {
  ItemResponse,
  NoteResponse,
  AttributesResponse,
} from "./responseData/update";

describe("update item cart responses", () => {
  defineGlobals();

  it("should return an update cart with a item changelog", async () => {
    const layer = makeMockLayerResponse(ItemResponse);

    const program = API.update({
      updates: {
        44632334565593: 1,
      },
    }).pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart.data?.items_changelog.added.at(0)).toEqual(
      ItemResponse.items_changelog.added.at(0),
    );
  });

  it("should return a cart with an updated note", async () => {
    const layer = makeMockLayerResponse(NoteResponse);

    const program = API.update({
      note: "Wow",
    }).pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart?.data?.note).toEqual(NoteResponse.note);
  });

  it("should return a cart with updated attributes", async () => {
    const layer = makeMockLayerResponse(AttributesResponse);

    const program = API.update({
      attributes: {
        test: "testing",
      },
    }).pipe(Effect.provide(layer));

    const cart = await Effect.runPromise(program);

    expect(cart?.data?.attributes.public).toEqual(
      AttributesResponse.attributes,
    );
  });
});
