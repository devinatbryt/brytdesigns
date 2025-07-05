export function hideElement<T extends HTMLElement>(element: T) {
  element.style.display = "none";
}

export function showElement<T extends HTMLElement>(element: T) {
  element.style.display = "block";
}
