import { FC } from 'react';
import { Link, LinkProps } from '@lidofinance/lido-ui';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

interface MatomoLinkProps extends LinkProps {
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
}

export const MatomoLink: FC<MatomoLinkProps> = (props) => {
  const { matomoEvent, ...rest } = props;

  const onClickHandler = () => {
    trackMatomoEvent(matomoEvent);
  };

  return <Link {...rest} onClick={onClickHandler} />;
};
