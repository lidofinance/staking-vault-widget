import { Address } from 'viem';
import { ToggleValue } from 'features/create-vault/consts';
import { SubmitStep } from 'features/create-vault/types';

export type CreateVaultDataContextValue = {
  step: number;
  permissionsView: ToggleValue;
  submitStep: SubmitStep;
  handleSetStep: (step: number) => void;
  handleSetPermissionsView: (value: ToggleValue) => void;
  handleCancelSubmit: () => void;
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
