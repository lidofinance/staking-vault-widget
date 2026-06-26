import type { Address } from 'viem';

export const appPaths = {
  myVaults: '/',
  vaults: {
    all: '/vaults',
    create: '/vaults/create',
    vault: (vaultAddress: Address | '[vaultAddress]') => {
      const address = vaultAddress.toLowerCase();

      return {
        overview: `/vaults/${address}`,
        eth: (mode: '[mode]' | 'supply' | 'withdraw') =>
          `/vaults/${address}/eth/${mode}` as const,
        steth: (mode: '[mode]' | 'mint' | 'repay') =>
          `/vaults/${address}/steth/${mode}` as const,
        disburse: `/vaults/${address}/disburse`,
        settings: (mode: '[mode]' | 'main' | 'permissions' | 'tier') =>
          `/vaults/${address}/settings/${mode}`,
        validators: `/vaults/${address}/validators`,
        rebalance: `/vaults/${address}/rebalance`,
      } as const;
    },
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
