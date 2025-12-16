import { useState, useEffect } from 'react';

import { devicesHeaderMedia } from 'styles/global';

const matchTabletMedia = () => {
  if ('matchMedia' in globalThis) {
    return globalThis.matchMedia(devicesHeaderMedia.tablet).matches;
  }

  return false;
};

export const useIdenticonSize = (tabletDiameter = 56, defaultDiameter = 72) => {
  const [diameter, setDiameter] = useState(() =>
    matchTabletMedia() ? tabletDiameter : defaultDiameter,
  );

  useEffect(() => {
    const resizeListener = () => {
      setDiameter(matchTabletMedia() ? tabletDiameter : defaultDiameter);
    };

    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, [tabletDiameter, defaultDiameter]);

  return diameter;
};
