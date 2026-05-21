import { trackMatomoEvent } from 'utils/track-matomo-event';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

const onClickHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
  const { target } = event;
  const matomoTarget = target instanceof Element ? target : null;
  const matomoEvent = matomoTarget
    ? matomoTarget.getAttribute('data-matomo')
    : null;

  if (!matomoEvent) return;

  trackMatomoEvent(matomoEvent as MATOMO_CLICK_EVENTS_TYPES);
};

export const useMatomoEventHandle = () => {
  return onClickHandler;
};
