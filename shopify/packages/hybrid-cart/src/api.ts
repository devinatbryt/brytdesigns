import { createHybridCartApi } from "@brytdesigns/shopify-hybrid-cart-api";

/**
 * @internal
 */
const API = createHybridCartApi({ debug: window?.BrytDesigns?.debug });

export default API;
