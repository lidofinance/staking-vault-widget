export type NavigationIcon =
  | 'gear'
  | 'withdraw'
  | 'validators'
  | 'mint'
  | 'mosaic'
  | 'stake'
  | 'rebalance'
  | 'folder'
  | 'globe';

export type NavigationRoutes = {
  title: string;
  path: string;
  icon: NavigationIcon;
  // overrides the icon in the mobile bottom bar
  mobileIcon?: NavigationIcon;
  exact: boolean;
  inMobileMenu?: boolean;
};

export type VaultRoutesConfig = {
  mode?: '[mode]';
};

export type DocsLink = {
  title: string;
  href: string;
};
