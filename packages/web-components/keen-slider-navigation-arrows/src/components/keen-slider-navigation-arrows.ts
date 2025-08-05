import type { CorrectComponentType } from "@brytdesigns/web-component-core/utils";

import html from "solid-js/html";
import { createEffect, createSignal, on, onCleanup, Show } from "solid-js";
import {
  withKeenSliderElementContext,
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

export type Props = {
  target: string;
  class: string;
  debug?: boolean;
};

export const Name = `keen-slider-navigation-arrows`;

export const Component: CorrectComponentType<Props> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      `${Name}: Needs a proper target in order to properly extend a keen slider.`,
    );

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
      if (props.debug) console.log(`${Name}: Slider instantiated`, slider);

      const handleArrowsUpdate = updateArrows(leftArrow, rightArrow);

      function hideAddIfDisabled(slider: KeenSliderInstance) {
        if (slider.options?.disabled)
          return element.setAttribute("data-keen-slider-disabled", "true");
        return element.removeAttribute("data-keen-slider-disabled");
      }

      function handleUpdate(slider: KeenSliderInstance) {
        if (props.debug)
          console.log(`${Name}: Updating navigation arrows`, element);
        hideAddIfDisabled(slider);
        handleArrowsUpdate(slider);
        if (!hasMoreSlides(slider)) {
          if (props.debug)
            console.log(`${Name}: Hiding navigation arrows`, element);
          addHiddenStyles(element);
        } else {
          if (props.debug)
            console.log(`${Name}: Showing navigation arrows`, element);
          addVisibleStyles(element);
        }
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
      if (slider && hasMoreSlides(slider)) return addVisibleStyles(element);
      if (props.debug)
        console.log(`${Name}: Slider is undefined, hiding arrows`, element);
      addHiddenStyles(element);
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
        slider.on("destroyed", () => setSlider());
      });

      onCleanup(removePlugin);
    },
  );

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

  element.replaceChildren(...[]);

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
