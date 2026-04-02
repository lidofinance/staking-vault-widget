import { type FC, type ReactNode, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Stake, Withdraw, Validators } from '@lidofinance/lido-ui';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { ReactComponent as MintRepay } from 'assets/icons/mint.svg';

import { routsClickEventsMap } from 'shared/components/layout/navigation/const';
import type { NavigationRoutes } from 'shared/components/layout/navigation/types';

import { ListItem, NavLink } from './styles';

export type NavigationLinkProps = {
  icon: NavigationRoutes['icon'];
  title: string;
  path: string;
  pathname?: string;
  external?: boolean;
};

const iconsMap: Record<NavigationRoutes['icon'], ReactNode> = {
  stake: <Stake />,
  mint: <MintRepay />,
  withdraw: <Withdraw />,
  validators: <Validators />,
  mosaic: <MosaicIcon />,
  gear: <GearIcon />,
};

export const NavigationLink: FC<NavigationLinkProps> = ({
  title,
  icon,
  path,
  external,
  pathname: pathnameInfo,
}) => {
  const { pathname } = useRouter();
  const routeInfo = pathnameInfo ?? path;
  const pathIcon = iconsMap[icon];
  const isActivePath = routeInfo === pathname;

  const trackClickEvent = useCallback(() => {
    trackMatomoEvent(routsClickEventsMap[routeInfo]);
  }, [routeInfo]);

  return (
    <ListItem onClick={trackClickEvent} key={path}>
      <Link href={path} target={external ? '_blank' : undefined}>
        <NavLink active={isActivePath}>
          {pathIcon}
          <span>{title}</span>
        </NavLink>
      </Link>
    </ListItem>
  );
};
