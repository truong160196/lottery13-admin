import React, { createContext, useContext, useMemo } from "react";
import { useMedia } from "react-use";

export const MediaQueryContext = createContext({
  isMobile: false,
  isTabletAndDown: false,
});

const mediaQueries = {
  isMobile: "(max-width: 640px)",
  isTabletAndDown: "(max-width: 1024px)",
};

export default function MediaQueryProvider({ children }) {
  const isMobile = useMedia(mediaQueries.isMobile);
  const isTabletAndDown = useMedia(mediaQueries.isTabletAndDown);
  const value = useMemo(() => ({ isMobile, isTabletAndDown }), [
    isMobile,
    isTabletAndDown,
  ]);

  return (
    <MediaQueryContext.Provider value={value}>
      {children}
    </MediaQueryContext.Provider>
  );
}

export function useMediaQuery() {
  return useContext(MediaQueryContext);
}
