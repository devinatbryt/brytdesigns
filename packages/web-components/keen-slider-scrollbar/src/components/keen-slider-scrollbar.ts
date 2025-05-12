import type { CorrectComponentType } from "@brytdesigns/web-component-utils";

import html from "solid-js/html";
import {
  createEffect,
  createSignal,
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
import { Draggable } from "@neodrag/vanilla";
import { animate } from "popmotion";

import {
  getRelativeBreakpoint,
  calculateMidpointPositionFromBP,
  findClosestBreakpoint,
  getMaxSlides,
  constrain,
  srOnly,
} from "../utils.js";

type KeenSliderScrollbarProps = {
  target: string;
  isHidden: boolean;
  isVertical: boolean;
};

export const KeenSliderScrollbar: CorrectComponentType<
  KeenSliderScrollbarProps
> = (props, { element }) => {
  if (!props.target)
    return console.warn(
      "keen-slider-scrollbar: Needs a proper target in order to properly extend a keen slider.",
    );
  let targetEl: HTMLElement | null = element;
  if (props.target) targetEl = document.querySelector(props.target);
  if (!targetEl)
    return console.warn(
      "keen-slider-scrollbar: Could not find the target element. Make sure it exists and is a keen-slider element.",
    );
  if (targetEl.tagName !== "KEEN-SLIDER")
    targetEl = targetEl.querySelector("keen-slider");
  if (!targetEl)
    return console.warn(
      "keen-slider-scrollbar: Could not find the target element. Make sure it exists and is a keen-slider element.",
    );
  const [slider] = getKeenSliderContext(targetEl);

  const [thumb, setThumb] = createSignal<HTMLElement | null>(null);
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [maxIdx, setMaxIdx] = createSignal(
    slider()?.track?.details?.maxIdx || 0,
  );
  const [currentIdx, setCurrentIdx] = createSignal(0);

  let breakpointsContainer: HTMLElement | null = null;

  const maxSlides = createMemo(
    on(maxIdx, (maxIdx) => {
      if (!maxIdx) return 0;
      return getMaxSlides(slider());
    }),
  );

  const draggable = createMemo(
    on(thumb, (thumb) => {
      if (!thumb) return null;
      const instance = new Draggable(thumb, {
        axis: props.isVertical ? "y" : "x",
        bounds: "parent",
        gpuAcceleration: true,
        position: position(),
        transform({ offsetX, offsetY }) {
          if (props.isVertical) return `translate3d(-50%, ${offsetY}px, 0)`;
          return `translate3d(${offsetX}px, -50%, 0)`;
        },
        onDrag: ({ offsetX, offsetY }) =>
          setPosition((p) => ({ ...p, x: offsetX, y: offsetY })),
        onDragEnd: (position) => {
          if (!breakpointsContainer) return;
          const bp = findClosestBreakpoint(
            position,
            breakpointsContainer.children,
            element,
            thumb,
          );
          if (!bp) return;
          const p = calculateMidpointPositionFromBP(bp, element, thumb);
          animateScrollbarPosition(p);
          updateSliderPosition(bp, slider());
          setCurrentIdx(parseInt(bp.getAttribute("data-index") || "0"));
        },
        ignoreMultitouch: true,
      });

      createEffect(
        on(position, (position) => {
          instance.updateOptions({
            position,
          });
        }),
      );

      return instance;
    }),
  );

  createEffect(
    on(draggable, (draggable) => {
      if (!draggable) return;
      onCleanup(() => {
        draggable.destroy();
      });
    }),
  );

  createEffect(
    on(slider, (slider) => {
      if (!slider) return;
      element.setAttribute(
        "is-vertical",
        `${slider.options?.vertical || false}`,
      );

      function handleDetailsChanged(slider: KeenSliderInstance) {
        element.setAttribute(
          "is-vertical",
          `${slider.options?.vertical || false}`,
        );
      }

      slider.on("detailsChanged", handleDetailsChanged);

      return onCleanup(() => {
        slider.on("detailsChanged", handleDetailsChanged, true);
      });
    }),
  );

  createEffect(
    on(maxSlides, (maxSlides) => {
      const s = slider();
      if (!maxSlides) return;
      element.style.setProperty(
        "--keen-slider-scrollbar--total-slides",
        `${maxSlides}`,
      );

      function updateDetails(slider: KeenSliderInstance) {
        setMaxIdx(slider.track.details.maxIdx);
      }

      function handleUpdate(slider: KeenSliderInstance) {
        if (!breakpointsContainer) return;
        const bp = breakpointsContainer.children[currentIdx()];
        if (!bp) return;
        const t = thumb();
        if (!t) return;
        const p = calculateMidpointPositionFromBP(bp, element, t);
        setPosition(p);
        setMaxIdx(slider.track.details.maxIdx);
      }

      s.on("detailsChanged", updateDetails);
      s.on("updated", handleUpdate);

      return onCleanup(() => {
        s.on("detailsChanged", updateDetails, true);
        s.on("updated", handleUpdate, true);
      });
    }),
  );

  createEffect(
    on(
      () => ({ thumb: thumb(), slider: slider() }),
      ({ thumb, slider }) => {
        if (!thumb || !slider) return;
        function updateScrollbarPosition(slider: KeenSliderInstance) {
          if (!breakpointsContainer) return;
          const bp = getRelativeBreakpoint(
            slider,
            breakpointsContainer.children,
          );
          if (!bp) return;
          if (!thumb) return;
          const position = calculateMidpointPositionFromBP(bp, element, thumb);
          animateScrollbarPosition(position);
          setCurrentIdx(parseInt(bp.getAttribute("data-index") || "0"));
        }
        slider.on("slideChanged", updateScrollbarPosition);
      },
    ),
  );

  createEffect(
    on(
      () => ({ thumb: thumb(), slider: slider() }),
      ({ thumb, slider }) => {
        if (!thumb || !slider) return;

        function handleClick(e: Event) {
          const bp = e.target as HTMLElement | null;
          if (!bp) return;
          if (!bp.classList.contains("keen-slider-scrollbar__breakpoint"))
            return;
          setCurrentIdx(parseInt(bp.getAttribute("data-index") || "0"));
          updateSliderPosition(bp, slider);
        }

        element.addEventListener("click", handleClick);

        return onCleanup(() => {
          element.removeEventListener("click", handleClick);
        });
      },
    ),
  );

  createEffect(
    on(maxIdx, (maxIdx) => {
      if (maxIdx === 0) element.setAttribute("is-hidden", `${true}`);
      else element.setAttribute("is-hidden", `${false}`);
    }),
  );

  function animateScrollbarPosition(p: { x: number; y: number }) {
    animate({
      from: position().x,
      to: p.x,
      onUpdate(latest) {
        return setPosition((p) => ({ ...p, x: latest }));
      },
    });
    animate({
      from: position().y,
      to: p.y,
      onUpdate(latest) {
        return setPosition((p) => ({ ...p, y: latest }));
      },
    });
  }

  function updateSliderPosition(bp: Element, slider: KeenSliderInstance) {
    const idx = constrain(
      parseInt(bp.getAttribute("data-index") || "0") *
      ((slider?.options?.slides as any)?.perScroll || 1),
      0,
      slider.track.details.maxIdx,
    );
    slider.moveToIdx(idx);
  }

  return html`
    <${Show} when=${() => maxSlides() > 1}>
      <div
        class="keen-slider-scrollbar__thumb"
        ref=${(el: HTMLElement) => setThumb(el)}
      ></div>
      <ul
        class="keen-slider-scrollbar__breakpoints"
        ref=${(el: HTMLElement) => (breakpointsContainer = el)}
      >
        <${For} each=${() => Array(maxSlides()).fill(0)}>
          ${(_: number, idx: Accessor<number>) => html`
            <li class="keen-slider-scrollbar__breakpoint" data-index=${idx}>
              <button type="button" style=${srOnly}>
                <span style=${srOnly}> Breakpoint ${idx} </span>
              </button>
            </li>
          `}
        <//>
      </ul>
    <//>
  `;
};
