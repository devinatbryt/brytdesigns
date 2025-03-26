import type {
  AnimationGeneratorType,
  AnimationPlaybackControls,
  Easing,
  RepeatType,
  Transition,
} from "motion";
import { POSITION, type Position } from "./consts";

export function hideElement<T extends HTMLElement>(element: T) {
  element.style.display = "none";
}

export function showElement<T extends HTMLElement>(element: T) {
  element.style.display = "block";
}

export async function controlPromise(controls: AnimationPlaybackControls) {
  return new Promise((resolve) => {
    controls.then(() => resolve(null));
  });
}

export function convertPositionToTranslate(position: Position) {
  if (position === POSITION.TOP || position === POSITION.BOTTOM)
    return ["translateY(var(--d-slide-from))", "translateY(var(--d-slide-to))"];

  return ["translateX(var(--d-slide-from))", "translateX(var(--d-slide-to))"];
}

export function getTransitionConfig(style: CSSStyleDeclaration) {
  const properties = {
    autoplay: style.getPropertyValue("--m-autoplay"),
    bounce: style.getPropertyValue("--m-bounce"),
    bounceDamping: style.getPropertyValue("--m-bounce-damping"),
    bounceStiffness: style.getPropertyValue("--m-bounce-stiffness"),
    duration: style.getPropertyValue("--m-duration"),
    damping: style.getPropertyValue("--m-damping"),
    delay: style.getPropertyValue("--m-delay"),
    ease: style.getPropertyValue("--m-ease"),
    elapsed: style.getPropertyValue("--m-elapsed"),
    mass: style.getPropertyValue("--m-mass"),
    max: style.getPropertyValue("--m-max"),
    min: style.getPropertyValue("--m-min"),
    power: style.getPropertyValue("--m-power"),
    repeat: style.getPropertyValue("--m-repeat"),
    repeatDelay: style.getPropertyValue("--m-repeat-delay"),
    repeatType: style.getPropertyValue("--m-repeat-type"),
    restDelta: style.getPropertyValue("--m-rest-delta"),
    restSpeed: style.getPropertyValue("--m-rest-speed"),
    startTime: style.getPropertyValue("--m-start-time"),
    timeConstant: style.getPropertyValue("--m-time-constant"),
    times: style.getPropertyValue("--m-times"),
    type: style.getPropertyValue("--m-type"),
    velocity: style.getPropertyValue("--m-velocity"),
    visualDuration: style.getPropertyValue("--m-visual-duration"),
  };
  return {
    autoplay: properties.autoplay === "true",
    bounce: properties.bounce ? parseFloat(properties.bounce) : undefined,
    bounceDamping: properties.bounceDamping
      ? parseFloat(properties.bounceDamping)
      : undefined,
    bounceStiffness: properties.bounceStiffness
      ? parseFloat(properties.bounceStiffness)
      : undefined,
    duration: properties.duration ? parseFloat(properties.duration) : undefined,
    damping: properties.damping ? parseFloat(properties.damping) : undefined,
    delay: properties.delay ? parseFloat(properties.delay) : undefined,
    ease: properties.ease as Easing,
    elapsed: properties.elapsed ? parseFloat(properties.elapsed) : undefined,
    mass: properties.mass ? parseFloat(properties.mass) : undefined,
    max: properties.max ? parseFloat(properties.max) : undefined,
    min: properties.min ? parseFloat(properties.min) : undefined,
    power: properties.power ? parseFloat(properties.power) : undefined,
    repeat: properties.repeat ? parseInt(properties.repeat) : undefined,
    repeatDelay: properties.repeatDelay
      ? parseFloat(properties.repeatDelay)
      : undefined,
    repeatType: properties.repeatType as RepeatType,
    restDelta: properties.restDelta
      ? parseFloat(properties.restDelta)
      : undefined,
    restSpeed: properties.restSpeed
      ? parseFloat(properties.restSpeed)
      : undefined,
    startTime: properties.startTime
      ? parseFloat(properties.startTime)
      : undefined,
    timeConstant: properties.timeConstant
      ? parseFloat(properties.timeConstant)
      : undefined,
    type: properties.type as AnimationGeneratorType,
    velocity: properties.velocity ? parseFloat(properties.velocity) : undefined,
    visualDuration: properties.visualDuration
      ? parseFloat(properties.visualDuration)
      : undefined,
  } satisfies Transition;
}
