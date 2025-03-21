import { createMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";

export type Input = string | null;

export const mutation = createMutation(
  () => ({
    mutationFn: async () => {
      const response = await API.clear({});

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
    },
    onSettled() {
      Cart.invalidate();
    },
  }),
  () => client,
);
