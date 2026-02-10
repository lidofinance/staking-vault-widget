import { NAV_TABLET_MAX_WIDTH } from 'styles/constants';
import { useMatchMedia } from 'shared/hooks';

export const useIdenticonSize = (tabletDiameter = 56, defaultDiameter = 72) => {
  const { isMatched } = useMatchMedia(NAV_TABLET_MAX_WIDTH);

  return isMatched ? tabletDiameter : defaultDiameter;
};
