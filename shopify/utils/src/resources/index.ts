import * as Effect from "effect/Effect";
import { Resource } from "../effect";

export const parseResource = (gid: Resource.GID) =>
  Effect.runSync(Resource.parse(gid));

type FormatResourceOptions<T extends Resource.ID, R extends Resource.Type> = {
  id: T;
  type: R;
};

export const formatResource = <
  const T extends Resource.ID,
  const R extends Resource.Type,
>(
  options: FormatResourceOptions<T, R>,
) => Effect.runSync(Resource.format<T, R>(options));

export type ID = Resource.ID;
export type GID = Resource.GID;
export type Type = Resource.Type;
