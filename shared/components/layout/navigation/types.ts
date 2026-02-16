export type NavigationRoutes = {
  title: string;
  path: string;
  icon: 'gear' | 'withdraw' | 'validators' | 'mint' | 'mosaic' | 'stake';
  exact: boolean;
  inMobileMenu?: boolean;
  external?: boolean;
};

export type VaultRoutesConfig = {
  mode?: '[mode]';
};
