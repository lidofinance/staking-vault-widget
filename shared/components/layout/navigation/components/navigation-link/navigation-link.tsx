import { type FC, type ReactNode, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Stake, Withdraw, Validators } from '@lidofinance/lido-ui';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { ReactComponent as MintRepay } from 'assets/icons/mint.svg';
import { ReactComponent as RebalanceIcon } from 'assets/icons/rebalance.svg';
import { ReactComponent as FolderIcon } from 'assets/icons/folder.svg';
import { ReactComponent as GlobeIcon } from 'assets/icons/globe.svg';

import { routsClickEventsMap } from 'shared/components/layout/navigation/const';
import type { NavigationIcon } from 'shared/components/layout/navigation/types';

import { DesktopIcon, ListItem, MobileIcon, NavLink } from './styles';

export type NavigationLinkProps = {
  icon: NavigationIcon;
  mobileIcon?: NavigationIcon;
  title: string;
  path: string;
  pathname?: string;
};

const iconsMap: Record<NavigationIcon, ReactNode> = {
  stake: <Stake />,
  mint: <MintRepay />,
  withdraw: <Withdraw />,
  validators: <Validators />,
  mosaic: <MosaicIcon />,
  gear: <GearIcon />,
  rebalance: <RebalanceIcon />,
  folder: <FolderIcon />,
  globe: <GlobeIcon />,
};

export const NavigationLink: FC<NavigationLinkProps> = ({
  title,
  icon,
  mobileIcon,
  path,
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
      <Link href={path}>
        <NavLink active={isActivePath}>
          {mobileIcon ? (
            <>
              <DesktopIcon>{pathIcon}</DesktopIcon>
              <MobileIcon>{iconsMap[mobileIcon]}</MobileIcon>
            </>
          ) : (
            pathIcon
          )}
          <span>{title}</span>
        </NavLink>
      </Link>
    </ListItem>
  );
};
