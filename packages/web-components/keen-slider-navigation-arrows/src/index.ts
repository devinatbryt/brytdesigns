import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderNavigationArrows } from "./components/index.js";
import { initializeClasses } from "./utils.js";

customShadowlessElement(
  "keen-slider-navigation-arrows",
  {
    class: "",
    target: "",
  },
  correctElementType(KeenSliderNavigationArrows),
  //@ts-ignore
  initializeClasses
);
