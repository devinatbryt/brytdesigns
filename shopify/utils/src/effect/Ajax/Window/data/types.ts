export interface IShopifyRoutes {
  readonly account_addresses_url: string;
  readonly account_login_url: string;
  readonly account_logout_url: string;
  readonly account_recover_url: string;
  readonly account_register_url: string;
  readonly account_url: string;
  readonly all_products_collection_url: string;
  readonly cart_add_url: string;
  readonly cart_change_url: string;
  readonly cart_clear_url: string;
  readonly cart_update_url: string;
  readonly cart_url: string;
  readonly collections_url: string;
  readonly predictive_search_url: string;
  readonly product_recommendations_url: string;
  readonly root_url: string;
  readonly search_url: string;
  readonly storefront_login_url: string;
}

export interface IStorefrontClientConfig {
  readonly accessToken: string;
  readonly shopName: string;
  apiVersion: string;
}

declare global {
  interface Window {
    Shopify: {
      routes: IShopifyRoutes;
      storefront: {
        config: IStorefrontClientConfig;
      };
    };
  }
}
