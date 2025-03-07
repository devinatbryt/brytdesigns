import { createSolidifrontConfig } from "@solidifront/codegen";

export default createSolidifrontConfig({
  generates: {
    storefront: {
      moduleName: "@solidifront/storefront-client/effect",
      path: ".",
    },
  },
});
