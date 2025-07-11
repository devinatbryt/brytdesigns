import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSliderNavigationArrows } from "./components/index.js";
import { initializeClasses } from "./utils.js";

customShadowlessElement(
  KeenSliderNavigationArrows.Name,
  {
    class: "",
    target: "",
    debug: false,
  },
  correctElementType(KeenSliderNavigationArrows.Component),
  //@ts-ignore
  initializeClasses,
);
