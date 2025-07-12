import type { KeenSliderInstance } from "@brytdesigns/web-component-keen-slider";
import type { ICustomElement } from "component-register";
import type { DragEventData } from "@neodrag/vanilla";

export const srOnly = `border-width:0 !important;clip:rect(1px, 1px, 1px, 1px) !important;-webkit-clip-path:inset(50%) !important;clip-path:inset(50%) !important;height:1px !important;margin-top:-1px !important;margin-bottom:-1px !important;margin-right:-1px !important;margin-left:-1px !important;overflow:hidden !important;padding-top:0 !important;padding-bottom:0 !important;padding-right:0 !important;padding-left:0 !important;position:absolute !important;width:1px !important;white-space:nowrap !important;`;

export function constrain(value: number, min = -Infinity, max = Infinity) {
  return Math.max(Math.min(value, max), min);
}

export function calculateMidpointPositionFromBP(
  bp: Element,
  container: HTMLElement,
  scrollbar: HTMLElement,
) {
  const bpRect = bp.getBoundingClientRect(),
    scrollbarRect = scrollbar.getBoundingClientRect(),
    containerRect = container.getBoundingClientRect(),
    relativeLeft = bpRect.left - containerRect.left,
    minX = 0,
    maxX = containerRect.width - scrollbarRect.width,
    relativeTop = bpRect.top - containerRect.top,
    minY = 0,
    maxY = containerRect.height - scrollbarRect.height,
    x = constrain(
      relativeLeft + bpRect.width / 2 - scrollbarRect.width / 2,
      minX,
      maxX,
    ),
    y = constrain(
      relativeTop + bpRect.height / 2 - scrollbarRect.height / 2,
      minY,
      maxY,
    );

  return { x, y };
}

export function findClosestBreakpoint(
  position: DragEventData,
  breakpoints: HTMLCollection,
  container: HTMLElement,
  scrollbar: HTMLElement,
) {
  const min = 0,
    max = breakpoints.length - 1;

  let closestDiff = { x: Infinity, y: Infinity },
    bpIndex = min;

  for (let i = min; i <= max; i++) {
    const bp = breakpoints[i];
    if (!bp) continue;
    const midpointP = calculateMidpointPositionFromBP(bp, container, scrollbar);
    const diffX = Math.abs(midpointP.x - position.offsetX);
    const diffY = Math.abs(midpointP.y - position.offsetY);
    if (diffX <= closestDiff.x && diffY <= closestDiff.y) {
      closestDiff = { x: diffX, y: diffY };
      bpIndex = i;
    }
  }

  return breakpoints[bpIndex];
}

export function getMaxSlides(slider: KeenSliderInstance) {
  const maxIdx = slider?.track?.details?.maxIdx || 1;
  const perScroll = (slider.options?.slides as any)?.perScroll || 1;

  if (!Number.isFinite(maxIdx)) {
    return Math.ceil(slider.slides.length / perScroll);
  }

  return Math.ceil(maxIdx / perScroll) + 1;
}

export function getRelativeBreakpoint(
  slider: KeenSliderInstance,
  breakpoints: HTMLCollection,
) {
  const maxSlides = getMaxSlides(slider),
    perScroll = (slider.options?.slides as any)?.perScroll || 1;

  const relativeIdx = constrain(
    Math.ceil(slider.track.details.rel / perScroll),
    0,
    maxSlides - 1,
  );

  return breakpoints[relativeIdx];
}
