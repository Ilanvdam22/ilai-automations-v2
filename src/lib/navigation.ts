export function navigateToSlide(row: number, col = 0) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("fullpage-navigate", { detail: { row, col } })
    );
  }
}
