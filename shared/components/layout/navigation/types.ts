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
    | 'rebalance';
  exact: boolean;
  inMobileMenu?: boolean;
};

export type VaultRoutesConfig = {
  mode?: '[mode]';
};
