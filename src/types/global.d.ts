interface TldrActiveTooltips extends Map<HTMLElement, HTMLDivElement> {}

declare global {
  interface Window {
    __tldrActiveTooltips?: TldrActiveTooltips;
  }
}

export {};
