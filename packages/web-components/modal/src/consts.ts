export type Action = (typeof ACTION)[keyof typeof ACTION];

export const ACTION = {
  OPEN: "open",
  CLOSE: "close",
  TOGGLE: "toggle",
};

export const EVENT_NAMESPACE = `bryt:modal` as const;
