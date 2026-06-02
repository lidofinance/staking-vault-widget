import type { z } from 'zod';

import type { VaultOverviewData } from 'modules/vaults';

import type { rebalanceFormSchema } from 'features/rebalance/content';

export type RebalanceFormValidationContext = VaultOverviewData | undefined;

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
