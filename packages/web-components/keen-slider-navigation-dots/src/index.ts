import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";
import { KeenSliderNavigationDots } from "./components/keen-slider-navigation-dots.js";
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
