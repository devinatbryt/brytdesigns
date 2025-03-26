import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";

import {
  DrawerContent,
  DrawerContext,
  DrawerTrigger,
  DrawerBackdrop,
} from "./components/index.js";

customShadowlessElement(
  "drawer-context",
  {
    isOpen: false,
    id: "",
    closeOnEscape: false,
    shouldTrapFocus: false,
    isAnimating: false,
  },
  correctElementType(DrawerContext),
);

customShadowlessElement(
  "drawer-trigger",
  { target: "", action: "", on: "click", preventDefault: true },
  correctElementType(DrawerTrigger),
);

customShadowlessElement(
  "drawer-backdrop",
  {},
  correctElementType(DrawerBackdrop),
);

customShadowlessElement(
  "drawer-content",
  {},
  correctElementType(DrawerContent),
);

export { useDrawer, getDrawerContext } from "./hooks/index.js";
