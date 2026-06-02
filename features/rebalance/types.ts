import type { z } from 'zod';

import type { VaultOverviewData } from 'modules/vaults';
import type {
  VerificationConfirmationFlags,
  VerificationConfirmFieldValues,
} from 'shared/components/banners/additional-verification';

import { rebalanceFormSchema } from 'features/rebalance/shared';

export type RebalanceFormValidationContext =
  | {
      overviewData: VaultOverviewData;
      ethBalance: bigint;
      additionalVerification: VerificationConfirmationFlags;
    }
  | undefined;

export type RebalanceFormAwaitableValidationContext =
  Promise<RebalanceFormValidationContext>;

export type RebalanceFormValidatedValues = z.infer<
  ReturnType<typeof rebalanceFormSchema>
>;

export type RebalanceFormFieldValues = VerificationConfirmFieldValues & {
  rebalanceAmount: bigint | null;
  isSupplyEth: boolean;
  supplyEth: bigint | null;
};
