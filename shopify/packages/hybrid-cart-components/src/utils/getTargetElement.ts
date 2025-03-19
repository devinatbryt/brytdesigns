export function getTargetElement(rootElement: HTMLElement, target: string) {
  if (!target) return rootElement;
  const t = rootElement.querySelector(target);
  if (!t) {
    console.error(`target element not found: ${target}`);
    return null;
  }
  return t;
}
