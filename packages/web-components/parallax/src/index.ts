import {
  customShadowlessElement,
  correctElementType,
} from "@brytdesigns/web-component-utils";

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
  {
    range: [0, 1],
    ...ParallaxAnimation.PROPS,
  },
  correctElementType(ParallaxAnimation.Component),
);

export {
  useParallax,
  getParallaxContext,
  useParallaxStickyLayer,
  getParallaxStickyLayerContext,
} from "./hooks/index.js";
