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

export enum ManifestConfigPageEnum {
  main = '/',
  overview = '/overview',
  settings = '/settings',
  createVault = '/settings/create-vault',
}

export type ManifestConfigPage = `${ManifestConfigPageEnum}`;

export const ManifestConfigPageList = new Set<ManifestConfigPage>(
  Object.values(ManifestConfigPageEnum),
);

export type ExternalConfig = Omit<ManifestEntry, 'config'> &
  ManifestConfig & {
    fetchMeta: UseQueryResult<ManifestEntry>;
  };
