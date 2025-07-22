import { useMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";
import { DEFAULT_HEADERS } from "../const.js";

export type Input = string | null;

export const mutation = useMutation(
  () => ({
    mutationFn: async () => {
      const response = await API.clear({}, { headers: DEFAULT_HEADERS });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    async onMutate() {
      await Cart.cancel();
      const previousCart = Cart.get();

      Cart.set((old) => ({
        ...old,
        item_count: 0,
        items: [],
      }));

      return { previousCart };
    },
    onError(_, __, context) {
      if (context?.previousCart) Cart.set(() => context.previousCart);
      Cart.invalidate();
    },
    onSuccess(cart) {
      if (!cart) return Cart.invalidate();
      Cart.set(() => cart);
    },
  }),
  () => client,
);
