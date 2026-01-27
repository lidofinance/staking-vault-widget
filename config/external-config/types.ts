import type { UseQueryResult } from '@tanstack/react-query';

export type Manifest = Record<string, ManifestEntry>;

export type ManifestEntry = {
  cid?: string;
  ens?: string;
  leastSafeVersion?: string;
  config: ManifestConfig;
};

export type ManifestConfig = {
  featureFlags: Record<string, boolean>;
  pages?: {
    [page in ManifestConfigPage]?: {
      shouldDisable?: boolean;
      sections?: [string, ...string[]];
    };
  };
};
// TODO adjust for vaults routing
export enum ManifestConfigPageEnum {
  main = '/',
  overview = '/overview',
  settings = '/settings',
  createVault = '/create-vault',
  supply = '/supply',
  adjustment = '/adjustment',
  validators = '/validators',
  disburse = '/disburse',
  notFound = '/404',
}

export type ManifestConfigPage = `${ManifestConfigPageEnum}`;

export const ManifestConfigPageList = new Set<ManifestConfigPage>(
  Object.values(ManifestConfigPageEnum),
);

export type ExternalConfig = Omit<ManifestEntry, 'config'> &
  ManifestConfig & {
    fetchMeta: UseQueryResult<ManifestEntry>;
  };
