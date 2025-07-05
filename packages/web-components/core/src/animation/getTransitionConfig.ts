import type {
  Easing,
  Transition,
  AnimationGeneratorType,
  RepeatType,
} from "motion";

export function getTransitionConfig(style: CSSStyleDeclaration) {
  const properties = {
    bounce: style.getPropertyValue("--motion--bounce"),
    bounceDamping: style.getPropertyValue("--motion--bounce-damping"),
    bounceStiffness: style.getPropertyValue("--motion--bounce-stiffness"),
    duration: style.getPropertyValue("--motion--duration"),
    damping: style.getPropertyValue("--motion--damping"),
    delay: style.getPropertyValue("--motion--delay"),
    ease: style.getPropertyValue("--motion--ease"),
    elapsed: style.getPropertyValue("--motion--elapsed"),
    mass: style.getPropertyValue("--motion--mass"),
    max: style.getPropertyValue("--motion--max"),
    min: style.getPropertyValue("--motion--min"),
    power: style.getPropertyValue("--motion--power"),
    repeat: style.getPropertyValue("--motion--repeat"),
    repeatDelay: style.getPropertyValue("--motion--repeat-delay"),
    repeatType: style.getPropertyValue("--motion--repeat-type"),
    restDelta: style.getPropertyValue("--motion--rest-delta"),
    restSpeed: style.getPropertyValue("--motion--rest-speed"),
    startTime: style.getPropertyValue("--motion--start-time"),
    timeConstant: style.getPropertyValue("--motion--time-constant"),
    times: style.getPropertyValue("--motion--times"),
    type: style.getPropertyValue("--motion--type"),
    velocity: style.getPropertyValue("--motion--velocity"),
    visualDuration: style.getPropertyValue("--motion--visual-duration"),
  };
  return {
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
    ease: (properties.ease ? properties.ease : undefined) as Easing,
    elapsed: properties.elapsed ? parseFloat(properties.elapsed) : undefined,
    mass: properties.mass ? parseFloat(properties.mass) : undefined,
    max: properties.max ? parseFloat(properties.max) : undefined,
    min: properties.min ? parseFloat(properties.min) : undefined,
    power: properties.power ? parseFloat(properties.power) : undefined,
    repeat: properties.repeat ? parseInt(properties.repeat) : undefined,
    repeatDelay: properties.repeatDelay
      ? parseFloat(properties.repeatDelay)
      : undefined,
    repeatType: (properties.repeatType
      ? properties.repeatType
      : undefined) as RepeatType,
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
    type: (properties.type
      ? properties.type
      : undefined) as AnimationGeneratorType,
    velocity: properties.velocity ? parseFloat(properties.velocity) : undefined,
    visualDuration: properties.visualDuration
      ? parseFloat(properties.visualDuration)
      : undefined,
  } satisfies Transition;
}
