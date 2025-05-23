import type API from "./api";

export type CartData = NonNullable<Awaited<ReturnType<typeof API.get>>["data"]>;
