import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSliderAutoplay } from "./components/index.js";

customShadowlessElement(
  KeenSliderAutoplay.Name,
  {
    target: "keen-slider",
    duration: 2000,
    totalSlides: 0,
  },
  correctElementType(KeenSliderAutoplay.Component),
);
