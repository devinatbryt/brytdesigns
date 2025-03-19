import type { IStorefrontClientConfig } from "./types.js";

import * as Data from "effect/Data";

export class StorefrontClientConfig extends Data.Class<IStorefrontClientConfig> {
  constructor() {
    super({
      ...window.BrytDesigns.storefront.config,
    });
  }
}

export const make = () =>
  Data.case<StorefrontClientConfig>()({
    ...window.BrytDesigns.storefront.config,
  });
