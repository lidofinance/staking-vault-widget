import type { z } from 'zod';

import type { VaultOverviewData } from 'modules/vaults';

import { rebalanceFormSchema } from 'features/rebalance/shared';

export type RebalanceFormValidationContext =
  | {
      overviewData: VaultOverviewData;
      ethBalance: bigint;
    }
  | undefined;

export type RebalanceFormAwaitableValidationContext =
  Promise<RebalanceFormValidationContext>;

export type RebalanceFormValidatedValues = z.infer<
  ReturnType<typeof rebalanceFormSchema>
>;

export type RebalanceFormFieldValues = {
  rebalanceAmount: bigint | null;
  isSupplyEth: boolean;
  supplyEth: bigint | null;
};
