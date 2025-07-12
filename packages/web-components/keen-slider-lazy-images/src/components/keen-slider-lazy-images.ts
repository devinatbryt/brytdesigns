import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import {
  withKeenSliderElementContext,
  type KeenSliderInstance,
} from "@brytdesigns/web-component-keen-slider";
import { onCleanup } from "solid-js";

type Props = {
  target: string;
};

export const Name = "keen-slider-lazy-images";

function loadImage(image: HTMLImageElement) {
  if (!image.hasAttribute("data-src") && !image.hasAttribute("data-srcset"))
    return;
  function onImageLoaded() {
    image.setAttribute("data-loaded", "true");
    image.removeEventListener("load", onImageLoaded);
  }
  image.setAttribute("data-loaded", "false");
  image.addEventListener("load", onImageLoaded);
  if (image.hasAttribute("data-src")) {
    image.setAttribute("src", `${image.getAttribute("data-src")}`);
  }
  if (image.hasAttribute("data-srcset")) {
    image.setAttribute("srcset", `${image.getAttribute("data-srcset")}`);
  }
  image.removeAttribute("data-src");
  image.removeAttribute("data-srcset");
}

function loadImages(slides: Element[]) {
  slides.forEach((slide) => {
    if (!slide) return;
    const images = slide.querySelectorAll("img");
    if (!images.length) return;

    images.forEach(loadImage);
  });
}

type ItemWithPortion = { portion: number };

function getVisibleIndexes(items: ItemWithPortion[]): number[] {
  return items.reduce<number[]>((visibleIndexes, item, index) => {
    if (item.portion > 0) visibleIndexes.push(index);
    return visibleIndexes;
  }, []);
}

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      `${Name}: Needs a proper target in order to properly extend a keen slider.`,
    );

  withKeenSliderElementContext(
    () => {
      const selector = props.target;
      return () => {
        let targetEl: Element | null = element;
        if (props.target) targetEl = document.querySelector(selector);
        if (targetEl?.tagName !== "KEEN-SLIDER")
          targetEl = targetEl!.querySelector("keen-slider");
        return targetEl!;
      };
    },
    () => null,
    ([_, { addPlugin }]) => {
      const removePlugin = addPlugin((slider) => {
        let slidesLoaded = new Set();
        function handleSlideEvent(slider: KeenSliderInstance) {
          if (slider.options.disabled) return loadImages(slider.slides);
          const visibleIndexes = getVisibleIndexes(slider.track.details.slides);
          const slides = visibleIndexes
            .map((index) => {
              const slide = slider.slides[index]!;
              if (slidesLoaded.has(slider.slides[index]!)) return null;
              slidesLoaded.add(slider.slides[index]!);
              return slide;
            })
            .filter((s) => !!s);
          loadImages(slides);
        }

        slider.on("created", handleSlideEvent);
        slider.on("slideChanged", handleSlideEvent);
        slider.on("detailsChanged", handleSlideEvent);
      });
      onCleanup(removePlugin);
    },
  );
};
