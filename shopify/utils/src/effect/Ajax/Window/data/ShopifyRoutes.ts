import type { IShopifyRoutes } from "./types.js";

import * as Data from "effect/Data";

export const Defaults: IShopifyRoutes = {
  account_addresses_url: "/account/addresses",
  account_login_url: "/account/login",
  account_logout_url: "/account/logout",
  account_recover_url: "/account/recover",
  account_register_url: "/account/register",
  account_url: "/account",
  all_products_collection_url: "/collections/all",
  product_url: "/products/:handle",
  products_url: "/products",
  cart_add_url: "/cart/add.js",
  cart_change_url: "/cart/change.js",
  cart_clear_url: "/cart/clear.js",
  cart_update_url: "/cart/update.js",
  cart_url: "/cart.js",
  collections_url: "/collections",
  predictive_search_url: "/search/suggest",
  product_recommendations_url: "/recommendations/products",
  root_url: "/",
  search_url: "/search",
  storefront_login_url:
    "/customer_authentication/login?return_to=%2Fservices%2Fliquid_rendering%2Fresource%3Ffast_storefront_renderer%3D1&locale=en",
};

export class ShopifyRoutes extends Data.Class<IShopifyRoutes> {
  constructor() {
    super({
      ...Defaults,
      ...(window?.BrytDesigns?.routes || {}),
    });
  }
}

export const make = () =>
  Data.case<ShopifyRoutes>()({
    ...Defaults,
    ...(window?.BrytDesigns?.routes || {}),
  });
