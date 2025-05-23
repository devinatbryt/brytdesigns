import { QueryClient } from "@tanstack/solid-query";
import { persistQueryClient } from "@tanstack/solid-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import lz from "lz-string";

const client = new QueryClient();

persistQueryClient({
  queryClient: client,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
    serialize: (data) => lz.compressToUTF16(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(lz.decompressFromUTF16(data)),
    key: "brytdesigns-hybrid-cart",
  }),
});

export default client;
