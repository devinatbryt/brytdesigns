import type { CartData } from "../types";

import { createQuery } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";

export const KEY = "cart";
export const invalidate = () => client.invalidateQueries({ queryKey: [KEY] });
export const set = (cb: (data: CartData) => CartData) =>
  client.setQueryData([KEY], cb);
export const cancel = async () => client.cancelQueries({ queryKey: [KEY] });
export const get = () => client.getQueryData([KEY]) as CartData;

export const query = createQuery(
  () => ({
    queryKey: [KEY],
    async queryFn({ signal }) {
      const cart = await API.get({}, { signal });
      if (cart?.error || !cart?.data) {
        throw cart.error;
      }
      return cart.data;
    },
    initialData: window.BrytDesigns.initialCart,
    staleTime: 1000 * 60 * 5,
    throwOnError: true,
  }),
  () => client,
);
