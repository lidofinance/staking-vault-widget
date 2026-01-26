import type { Address } from 'viem';

export const appPaths = {
  myVaults: '/',
  vaults: {
    all: '/vaults',
    create: '/vaults/create',
    vault: (vaultAddress: Address | '[vaultAddress]') =>
      ({
        overview: `/vaults/${vaultAddress}`,
        eth: (mode: '[mode]' | 'supply' | 'withdraw') =>
          `/vaults/${vaultAddress}/eth/${mode}` as const,
        steth: (mode: '[mode]' | 'mint' | 'repay') =>
          `/vaults/${vaultAddress}/steth/${mode}` as const,
        disburse: `/vaults/${vaultAddress}/disburse`,
        settings: (mode: '[mode]' | 'main' | 'permissions' | 'tier') =>
          `/vaults/${vaultAddress}/settings/${mode}`,
        validators: `/vaults/${vaultAddress}/validators`,
      }) as const,
  },
} as const;

type StringValues<T> =
  T extends Record<string, infer U> ? (U extends string ? U : never) : never;

type ObjectValues<T> = T extends string
  ? T
  : T extends Record<string, infer U>
    ? StringValues<T> | ObjectValues<U> | FunctionValues<U>
    : never;

type FunctionValues<T> = T extends (...args: any[]) => infer R
  ? ObjectValues<R>
  : never;

export type AppPathsType = ObjectValues<typeof appPaths>;
