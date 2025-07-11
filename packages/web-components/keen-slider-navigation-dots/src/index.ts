import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSliderNavigationDots } from "./components/index.js";
import { initializeClasses } from "./utils.js";

customShadowlessElement(
  KeenSliderNavigationDots.Name,
  {
    target: "",
  },
  correctElementType(KeenSliderNavigationDots.Component),
  //@ts-ignore
  initializeClasses,
);
