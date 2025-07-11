export function checkLoaded() {
  return (
    document.readyState === "complete" ||
    //@ts-ignore
    document.readyState === "loaded" ||
    document.readyState === "interactive"
  );
}
