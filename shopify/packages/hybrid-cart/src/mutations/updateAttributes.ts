import { createMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";

export type Input = NonNullable<Parameters<typeof API.update>[0]["attributes"]>;

export const mutation = createMutation(
  () => ({
    mutationFn: async (attributes: Input) => {
      const response = await API.update({
        attributes,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
    async onMutate(attributes) {
      await Cart.cancel();
      const previousCart = Cart.get();

      Cart.set((old) => ({
        ...old,
        attributes: {
          ...old.attributes,
          ...attributes,
        },
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
