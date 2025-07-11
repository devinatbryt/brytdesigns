import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";
import { provideParallaxContext } from "../../hooks/index.js";

type ParallaxContainerProps = {
  maxPages: number;
};

export const Name = `parallax-container`;

export const Component: CorrectComponentType<ParallaxContainerProps> = (
  props,
  { element },
) => {
  if (!props.maxPages)
    return console.warn(
      `${Name}: requires max-pages attribute to be set!`,
      element,
    );
  if (props.maxPages < 1)
    return console.warn(
      `${Name}: max-pages must be greater than or equal to 1!`,
      element,
    );
  provideParallaxContext(props, element);
};
