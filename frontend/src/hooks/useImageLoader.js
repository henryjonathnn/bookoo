import { useState, useCallback } from "react";
import { debounce } from "lodash";

export const useImageLoader = (onLoadComplete) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(
    debounce(() => {
      setLoaded(true);
      onLoadComplete?.();
    }, 100),
    [onLoadComplete]
  );

  return {
    loaded,
    error,
    setError,
    handleLoad
  }
};
