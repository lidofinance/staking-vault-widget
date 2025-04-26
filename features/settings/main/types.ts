import { Address, Hash, Hex } from 'viem';
import { addressSchema, editMainSettingsSchema } from './consts';
import { z } from 'zod';
import { VaultInfo } from 'types';
import { VAULT_ROOT_ROLES } from 'modules/vaults';
import { SubmitStepEnum } from 'shared/components/submit-modal';

export type SubmittingMainFormStep = keyof typeof SubmitStepEnum | undefined;

export type MainSettingsContextValue = {
  submitStep: MainSettingsSubmittingInfo;
  handleCancelSubmit: () => void;
};

export type MainSettingsSubmittingInfo = {
  step: SubmittingMainFormStep;
  response?: { tx: Hash; key: keyof TxData }[];
};

export type GrantOrRevokeRole = {
  account: Address;
  role: Hex;
};

export type EditMainSettingsSchema = z.infer<typeof editMainSettingsSchema>;

export type InputDataType =
  | 'address'
  | 'percent'
  | 'time'
  | 'default'
  | 'number';

export type MainSettingsOverview = {
  name: string;
  title: string;
  label: string;
  editLabel: string;
  dataType: InputDataType;
  actionText?: string;
  vaultKey: keyof VaultInfo;
  canEditRole: VAULT_ROOT_ROLES | 'confirmingRoles';
};

export type TxData = {
  grantRoles: GrantOrRevokeRole[];
  revokeRoles: GrantOrRevokeRole[];
  confirmExpiry?: bigint;
  nodeOperatorFeeBP?: bigint;
};

export type RoleFieldSchema = z.infer<typeof addressSchema>;
