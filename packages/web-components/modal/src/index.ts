import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";

import {
  DrawerContent,
  ModalContext,
  DrawerTrigger,
  DrawerBackdrop,
} from "./components/index.js";

customShadowlessElement(
  "modal-context",
  {
    isOpen: false,
    id: "",
    closeOnEscape: false,
    shouldTrapFocus: false,
    isAnimating: false,
    openAfterDelay: false,
    delay: 0,
  },
  correctElementType(ModalContext),
);

customShadowlessElement(
  "modal-trigger",
  { target: "", action: "", on: "click", preventDefault: true },
  correctElementType(DrawerTrigger),
);

customShadowlessElement(
  "modal-backdrop",
  {},
  correctElementType(DrawerBackdrop),
);

customShadowlessElement("modal-content", {}, correctElementType(DrawerContent));

export { useModal, getModalContext } from "./hooks/index.js";
