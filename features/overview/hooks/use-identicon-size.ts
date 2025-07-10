import { useState, useEffect } from 'react';

import { devicesHeaderMedia } from 'styles/global';

const matchTabletMedia = () =>
  window.matchMedia(devicesHeaderMedia.tablet).matches;

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
