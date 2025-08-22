import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

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
  batch,
} from "solid-js";
import {
  withKeenSliderElementContext,
  type KeenSliderInstance,
} from "@brytdesigns/web-component-keen-slider";

import {
  addVisibleStyles,
  addHiddenStyles,
  getMaxSlides,
  constrain,
  srOnly,
} from "../utils.js";

type Props = {
  target: string;
};

export const Name = `keen-slider-navigation-dots`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      `${Name}: Needs a proper target in order to properly extend a keen slider.`,
    );

  const [slider, setSlider] = createSignal<KeenSliderInstance>();

  const [maxIdx, setMaxIdx] = createSignal(0);
  const [currentSlide, setCurrentSlide] = createSignal(0);

  const maxSlides = createMemo(
    on(maxIdx, (maxIdx) => {
      console.log(maxIdx);
      if (!maxIdx) return 0;
      const s = slider();
      if (!s) return 0;
      const maxSlides = getMaxSlides(s);
      console.log(maxSlides, s, maxIdx);
      return maxSlides;
    }),
  );

  createEffect(
    on(slider, (slider) => {
      if (!slider) return;

      function handleDetailsChange(slider: KeenSliderInstance) {
        setMaxIdx(slider.track.details.maxIdx);
        setCurrentSlide(getSlideIndex(slider));
      }

      function handleSlideChange(slider: KeenSliderInstance) {
        setMaxIdx(slider.track.details.maxIdx);
        setCurrentSlide(getSlideIndex(slider));
      }

      slider.on("detailsChanged", handleDetailsChange);
      slider.on("slideChanged", handleSlideChange);

      return onCleanup(() => {
        slider.on("detailsChanged", handleDetailsChange, true);
        slider.on("slideChanged", handleSlideChange, true);
      });
    }),
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
        setSlider(slider);

        slider.on("created", function (slider) {
          setMaxIdx(slider.track.details.maxIdx);
        });

        slider.on("destroyed", () =>
          batch(() => {
            setCurrentSlide(0);
            setMaxIdx(0);
            setSlider();
          }),
        );
      });

      onCleanup(removePlugin);
    },
  );

  createEffect(
    on(maxSlides, (maxSlides) => {
      if (!maxSlides || maxSlides <= 1) return addHiddenStyles(element);
      return addVisibleStyles(element);
    }),
  );

  const isSelected = createSelector(currentSlide);

  function getSlideIndex(s: KeenSliderInstance, idx?: number) {
    const perScroll = (s.options?.slides as any)?.perScroll || 1;
    return typeof idx === "number"
      ? idx * perScroll
      : Math.floor(s.track.details.rel / perScroll);
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
                    if (!s) return;
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
