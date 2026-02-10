import { useState, useEffect } from 'react';

const matchTabletMedia = (size: number) => {
  if ('matchMedia' in globalThis) {
    return globalThis.matchMedia(`screen and (max-width: ${size}px)`).matches;
  }

  return false;
};

export const useMatchMedia = (size: number) => {
  const [isMatched, setMatchedState] = useState(() => matchTabletMedia(size));

  useEffect(() => {
    const resizeListener = () => {
      setMatchedState(matchTabletMedia(size));
    };

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, [size]);

  return {
    isMatched,
  };
};
