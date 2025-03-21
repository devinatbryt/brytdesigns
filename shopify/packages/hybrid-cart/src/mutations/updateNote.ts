import { createMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";

export type Input = string | null;

export const mutation = createMutation(
  () => ({
    mutationFn: async (note: string | null) => {
      const response = await API.update({
        note,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    async onMutate(note) {
      await Cart.cancel();
      const previousCart = Cart.get();

      Cart.set((old) => ({
        ...old,
        note,
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
