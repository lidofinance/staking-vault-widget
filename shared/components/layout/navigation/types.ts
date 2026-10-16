export type NavigationRoutes = {
  title: string;
  path: string;
  icon:
    | 'gear'
    | 'withdraw'
    | 'validators'
    | 'mint'
    | 'mosaic'
    | 'stake'
    | 'rebalance'
    | 'folder'
    | 'globe';
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
