import { useMutation } from "@tanstack/solid-query";

import client from "../client.js";
import API from "../api.js";
import { Cart } from "../query/index.js";
import { DEFAULT_HEADERS } from "../const.js";

export type Input = Parameters<typeof API.add>[0]["items"][number];

export const mutation = useMutation(
  () => ({
    mutationFn: async (items: Input[]) => {
      const response = await API.add({ items }, { headers: DEFAULT_HEADERS });
      if (response?.error || !response.data) {
        throw response?.error;
      }
      return response.data;
    },
    onSettled() {
      Cart.invalidate();
    },
  }),
  () => client,
);
