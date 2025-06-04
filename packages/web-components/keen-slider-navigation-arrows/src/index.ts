import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderNavigationArrows } from "./components/index.js";
import { initializeClasses } from "./utils.js";

customShadowlessElement(
  KeenSliderNavigationArrows.Name,
  {
    class: "",
    target: "",
  },
  correctElementType(KeenSliderNavigationArrows.Component),
  //@ts-ignore
  initializeClasses,
);
