import { LIMIT_LEVEL } from 'types';
import { Address } from 'viem';

export type CreateVaultDataContextValue = {
  step: number;
  handleSetStep: (step: number) => void;
};

export type CreateVaultFormInput = {
  nodeOperator: Address | string;
  nodeOperatorFeeBP: number | null;
  curatorFeeBP: number | null;
  confirmExpiry: number | null;
  vaultManager: Address | string;
  nodeOperatorManager: Address | string;
  defaultAdmin: Address | string;
  confirmMainSettings: boolean;
  funders: Address[] | string[];
  withdrawers: Address[] | string[];
  minters: Address[] | string[];
  burners: Address[] | string[];
  rebalancers: Address[] | string[];
  depositPausers: Address[] | string[];
  depositResumers: Address[] | string[];
  validatorExitRequesters: Address[] | string[];
  validatorWithdrawalTriggerers: Address[] | string[];
  disconnecters: Address[] | string[];
  curatorFeeSetters: Address[] | string[];
  curatorFeeClaimers: Address[] | string[];
  nodeOperatorFeeClaimers: Address[] | string[];
};

export type CreateVaultFormValidationContext = {
  isWalletActive: boolean;
  stakingLimitLevel: LIMIT_LEVEL;
  currentCreateVaultLimit: bigint;
  gasCost: bigint;
  etherBalance: bigint;
  isSmartAccount: boolean;
  shouldValidateEtherBalance: boolean;
};
