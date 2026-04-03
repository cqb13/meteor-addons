import { useState, useCallback } from "preact/hooks";

const DEFAULT_ICON = "/default-addon-icon.webp";

export function useImageFallback(initialSrc: string) {
  const [src, setSrc] = useState(initialSrc);

  const handleError = useCallback((e: Event) => {
    const img = e.target as HTMLImageElement;
    if (img.src !== `${window.location.origin}${DEFAULT_ICON}`) {
      img.src = DEFAULT_ICON;
      setSrc(DEFAULT_ICON);
    }
  }, []);

  const reset = useCallback((newSrc: string) => {
    setSrc(newSrc);
  }, []);

  return {
    src,
    handleError,
    reset,
    defaultSrc: DEFAULT_ICON,
  };
}

export { DEFAULT_ICON };
