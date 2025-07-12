import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";
import { KeenSliderLazyImages } from "./components/index.js";

customShadowlessElement(
  KeenSliderLazyImages.Name,
  {
    target: "keen-slider",
    duration: 2000,
    totalSlides: 0,
  },
  correctElementType(KeenSliderLazyImages.Component),
);
