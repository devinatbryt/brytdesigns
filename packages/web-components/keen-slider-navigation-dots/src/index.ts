import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderNavigationDots } from "./components/index.js";
import { initializeClasses } from "./utils.js";

customShadowlessElement(
  "keen-slider-navigation-dots",
  {
    target: "",
  },
  correctElementType(KeenSliderNavigationDots),
  //@ts-ignore
  initializeClasses
);
