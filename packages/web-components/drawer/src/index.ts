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
  DrawerContext.Name,
  {
    isOpen: false,
    id: "",
    closeOnEscape: false,
    shouldTrapFocus: false,
    isAnimating: false,
    debug: false,
  },
  correctElementType(DrawerContext.Component),
);

customShadowlessElement(
  DrawerTrigger.Name,
  { target: "", action: "", on: "click", preventDefault: true },
  correctElementType(DrawerTrigger.Component),
);

customShadowlessElement(
  DrawerBackdrop.Name,
  {},
  correctElementType(DrawerBackdrop.Component),
);

customShadowlessElement(
  DrawerContent.Name,
  {},
  correctElementType(DrawerContent.Component),
);

export { useDrawer, getDrawerContext } from "./hooks/index.js";
