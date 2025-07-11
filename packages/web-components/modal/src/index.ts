import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";

import {
  ModalTrigger,
  ModalContext,
  ModalBackdrop,
  ModalPanel,
} from "./components/index.js";

customShadowlessElement(
  ModalContext.Name,
  {
    isOpen: false,
    id: "",
    closeOnEscape: false,
    shouldTrapFocus: false,
    isAnimating: false,
    openAfterDelay: false,
    delay: 0,
  },
  correctElementType(ModalContext.Component),
);

customShadowlessElement(
  ModalTrigger.Name,
  { target: "", action: "", on: "click", preventDefault: true },
  correctElementType(ModalTrigger.Component),
);

customShadowlessElement(
  ModalBackdrop.Name,
  {},
  correctElementType(ModalBackdrop.Component),
);

customShadowlessElement(
  ModalPanel.Name,
  {},
  correctElementType(ModalPanel.Component),
);

export {
  useModal,
  getModalContext,
  withModalElementContext,
} from "./hooks/index.js";
