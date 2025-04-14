import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import html from "solid-js/html";
import {
  createEffect,
  createSignal,
  createSelector,
  createMemo,
  on,
  onCleanup,
  Show,
  For,
  type Accessor,
} from "solid-js";
import {
  getKeenSliderContext,
  type KeenSliderInstance,
} from "@brytdesigns/web-component-keen-slider";

import {
  addVisibleStyles,
  addHiddenStyles,
  getMaxSlides,
  constrain,
  srOnly,
} from "../utils";

type KeenSliderNavigationDotsContextProps = {
  target: string;
};

export const KeenSliderNavigationDots: CorrectComponentType<
  KeenSliderNavigationDotsContextProps
> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      "keen-slider-navigation-dots: Needs a proper target in order to properly extend a keen slider."
    );
  let targetEl: HTMLElement | null = element;
  if (props.target) targetEl = document.querySelector(props.target);
  if (!targetEl)
    return console.warn(
      "keen-slider-navigation-dots: Could not find the target element. Make sure it exists and is a keen-slider element."
    );
  if (targetEl.tagName !== "KEEN-SLIDER")
    targetEl = targetEl.querySelector("keen-slider");
  if (!targetEl)
    return console.warn(
      "keen-slider-navigation-dots: Could not find the target element. Make sure it exists and is a keen-slider element."
    );
  const [slider] = getKeenSliderContext(targetEl);

  const [maxIdx, setMaxIdx] = createSignal(0);
  const [currentSlide, setCurrentSlide] = createSignal(0);

  const maxSlides = createMemo(
    on(maxIdx, (maxIdx) => {
      if (!maxIdx) return 0;
      return getMaxSlides(slider());
    })
  );

  createEffect(
    on(slider, (slider) => {
      if (!slider) return;

      function handleDetailsChange(slider: KeenSliderInstance) {
        setMaxIdx(slider.track.details.maxIdx);
      }

      function handleSlideChange(slider: KeenSliderInstance) {
        setCurrentSlide(getSlideIndex(slider));
      }

      function handleSlideDestroy() {
        setCurrentSlide(0);
        setMaxIdx(0);
      }

      slider.on("detailsChanged", handleDetailsChange);
      slider.on("slideChanged", handleSlideChange);
      slider.on("destroyed", handleSlideDestroy);

      return onCleanup(() => {
        slider.on("detailsChanged", handleDetailsChange, true);
        slider.on("slideChanged", handleSlideChange, true);
        slider.on("destroyed", handleSlideDestroy, true);
      });
    })
  );

  createEffect(
    on(maxSlides, (maxSlides) => {
      if (maxSlides <= 1) return addHiddenStyles(element);
      return addVisibleStyles(element);
    })
  );

  const isSelected = createSelector(currentSlide);

  function getSlideIndex(s: KeenSliderInstance, idx?: number) {
    const i = typeof idx === "number" ? idx : s.track.details.rel;
    return constrain(
      i * ((s?.options?.slides as any)?.perScroll || 1),
      0,
      s.track.details.maxIdx
    );
  }

  return html`
    <${Show} when=${() => maxSlides() > 1}>
      <ul class="keen-dots" role="tablist">
        <${For} each=${() => Array(maxSlides()).fill(0)}>
          ${(_: number, idx: Accessor<number>) => {
            return html`
              <li
                class=${() =>
                  `keen-dot ${isSelected(idx()) ? "keen-dot--active" : ""}`}
                role="presentation"
              >
                <button
                  onClick=${(e: Event) => {
                    const s = slider();
                    const i = getSlideIndex(s, idx());
                    s.moveToIdx(i);
                  }}
                  disabled=${() => isSelected(idx())}
                  class=${() => `keen-dot__button`}
                  aria-current=${() => isSelected(idx())}
                  type="button"
                >
                  <span style=${srOnly}>Go to slide ${() => idx() + 1}</span>
                </button>
              </li>
            `;
          }}
        <//>
      </ul>
    <//>
  `;
};
