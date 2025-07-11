import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-core/utils";

import {
  ParallaxContainer,
  ParallaxStickyLayer,
  ParallaxAnimation,
} from "./components/index.js";

customShadowlessElement(
  ParallaxContainer.Name,
  {
    maxPages: 2,
  },
  correctElementType(ParallaxContainer.Component),
);

customShadowlessElement(
  ParallaxStickyLayer.Name,
  {
    start: 1,
    end: 2,
  },
  correctElementType(ParallaxStickyLayer.Component),
);

customShadowlessElement(
  ParallaxAnimation.Name,
  ParallaxAnimation.PROPS,
  correctElementType(ParallaxAnimation.Component),
);

export {
  useParallax,
  getParallaxContext,
  useParallaxStickyLayer,
  getParallaxStickyLayerContext,
  withParallaxElementContext,
  withParallaxStickyLayerContext,
} from "./hooks/index.js";
