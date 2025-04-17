import { Address, Hash, Hex } from 'viem';
import { editMainSettingsSchema, SubmittingMainFormStepsEnum } from './consts';
import { z } from 'zod';
import { VaultInfo } from 'types';

export type SubmittingMainFormStep =
  | keyof typeof SubmittingMainFormStepsEnum
  | undefined;

export type MainSettingsContextValue = {
  submitStep: MainSettingsSubmittingInfo;
  handleCancelSubmit: () => void;
};

export type MainSettingsSubmittingInfo = {
  step: SubmittingMainFormStep;
  response?: { tx: Hash; key: keyof TxData }[];
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
};

export type TxData = {
  roles?: { account: Address; role: Hex }[];
  confirmExpiry?: bigint;
  nodeOperatorFeeBP?: bigint;
};
