import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import html from "solid-js/html";
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  Show,
} from "solid-js";
import {
  addPlugin,
  type KeenSliderInstance,
} from "@brytdesigns/web-component-keen-slider";

import {
  isFirstSlide,
  updateArrows,
  hasMoreSlides,
  addVisibleStyles,
  addHiddenStyles,
  isLastSlide,
  srOnly,
} from "../utils.js";

type KeenSliderNavigationArrowsContextProps = {
  target: string;
  class: string;
};

export const KeenSliderNavigationArrows: CorrectComponentType<
  KeenSliderNavigationArrowsContextProps
> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      "keen-slider-navigation-arrows: Needs a proper target in order to properly extend a keen slider.",
    );

  const target = createMemo(() => {
    let targetEl: HTMLElement | null = element;
    if (props.target) targetEl = document.querySelector(props.target);
    if (!targetEl)
      return console.warn(
        "keen-slider-navigation-arrows: Could not find the target element. Make sure it exists and is a keen-slider element.",
      );
    if (targetEl.tagName !== "KEEN-SLIDER")
      targetEl = targetEl.querySelector("keen-slider");
    if (!targetEl)
      return console.warn(
        "keen-slider-navigation-arrows: Could not find the target element. Make sure it exists and is a keen-slider element.",
      );

    return targetEl;
  });

  const [slider, setSlider] = createSignal<KeenSliderInstance>();
  const leftArrowTmpl = element.querySelector<HTMLTemplateElement>(
    "template[prev-arrow]",
  );
  const rightArrowTmpl = element.querySelector<HTMLTemplateElement>(
    "template[next-arrow]",
  );

  let leftArrow: HTMLElement, rightArrow: HTMLElement;

  createEffect(
    on(slider, (slider) => {
      if (!slider) return;

      const handleArrowsUpdate = updateArrows(leftArrow, rightArrow);

      function hideAddIfDisabled(slider: KeenSliderInstance) {
        if (slider.options?.disabled)
          return element.setAttribute("data-keen-slider-disabled", "true");
        return element.removeAttribute("data-keen-slider-disabled");
      }

      function handleUpdate(slider: KeenSliderInstance) {
        hideAddIfDisabled(slider);
        handleArrowsUpdate(slider);
      }

      slider.on("created", handleUpdate);
      slider.on("slideChanged", handleUpdate);
      slider.on("optionsChanged", handleUpdate);
      slider.on("destroyed", handleUpdate);

      return onCleanup(() => {
        slider.on("created", handleUpdate, true);
        slider.on("slideChanged", handleUpdate, true);
        slider.on("optionsChanged", handleUpdate, true);
        slider.on("destroyed", handleUpdate, true);
      });
    }),
  );

  createEffect(
    on(slider, (slider) => {
      if (!slider) return;

      if (!hasMoreSlides(slider)) return addHiddenStyles(element);
      return addVisibleStyles(element);
    }),
  );

  createEffect(() => {
    const t = target();
    if (!t) return;

    const controller = new AbortController();

    function plugin(slider: KeenSliderInstance) {
      setSlider(slider);
    }

    addPlugin({
      target: t,
      plugin,
      controller,
    });

    return onCleanup(() => {
      controller.abort();
      setSlider(undefined);
    });
  });

  function handlePrev(event: Event) {
    event.preventDefault();

    const s = slider();
    if (!s) return;

    s.prev();
  }

  function handleNext(event: Event) {
    event.preventDefault();

    const s = slider();

    if (!s) return;
    s.next();
  }

  return html`
    <button
      class="keen-arrow keen-arrow--left"
      disabled=${() => slider() && isFirstSlide(slider()!)}
      ref=${(el: HTMLElement) => (leftArrow = el)}
      onClick=${(e: Event) => handlePrev(e)}
      type="button"
    >
      <span style=${srOnly}>Previous slide</span>
      <${Show} when=${() => leftArrowTmpl}>
        ${() => leftArrowTmpl?.content.cloneNode(true)}
      <//>
    </button>
    <button
      class="keen-arrow keen-arrow--right"
      ref=${(el: HTMLElement) => (rightArrow = el)}
      disabled=${() => slider() && isLastSlide(slider()!)}
      onClick=${(e: Event) => handleNext(e)}
      type="button"
    >
      <span style=${srOnly}>Next slide</span>
      <${Show} when=${() => rightArrowTmpl}>
        ${() => rightArrowTmpl?.content.cloneNode(true)}
      <//>
    </button>
  `;
};
