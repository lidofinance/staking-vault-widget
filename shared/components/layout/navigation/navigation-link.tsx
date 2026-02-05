import { type FC, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trackEvent } from '@lidofinance/analytics-matomo';

import { MATOMO_CLICK_EVENTS } from 'consts/matomo-click-events';

import { routsClickEventsMap } from './const';
import { ListItem, NavLink } from './styles';

export type NavigationLinkProps = {
  title: string;
  path: string;
  customPathname?: string;
  icon: JSX.Element;
  external?: boolean;
};

export const NavigationLink: FC<NavigationLinkProps> = ({
  title,
  icon,
  path,
  customPathname,
  external,
}) => {
  const { pathname } = useRouter();
  const routePath = customPathname ?? path;
  const isActive = pathname === routePath;

  const trackClickEvent = useCallback(() => {
    trackEvent(...MATOMO_CLICK_EVENTS[routsClickEventsMap[routePath]]);
  }, [routePath]);

  return (
    <ListItem onClick={trackClickEvent} key={path}>
      <Link href={path} target={external ? '_blank' : undefined}>
        <NavLink active={isActive}>
          {icon}
          <span>{title}</span>
        </NavLink>
      </Link>
    </ListItem>
  );
};
