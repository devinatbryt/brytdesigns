import { createAjaxCartApi } from "@brytdesigns/shopify-ajax-cart-api";

/**
 * @internal
 */
const API = createAjaxCartApi({ debug: window?.BrytDesigns?.debug });

export default API;
