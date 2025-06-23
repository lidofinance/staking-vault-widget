import invariant from 'tiny-invariant';
import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

import {
  MainSettingsDataContextValue,
  RoleFieldSchema,
  EditMainSettingsSchema,
  VaultMainSettingsData,
} from './types';
import { multipleDataFields } from './consts';

export const shouldIncrementTxCounterByVoting = (
  value: string | undefined,
  defaultValue: string | undefined,
) => {
  return value !== defaultValue;
};

export const shouldIncrementTxCounterByAddresses = (
  formFields: EditMainSettingsSchema,
) => {
  let grant = 0;
  let remove = 0;

  multipleDataFields.forEach((key) => {
    const fields = formFields[key];
    fields.forEach((field: RoleFieldSchema) => {
      grant += Number(field.state === 'grant');
      remove += Number(field.state === 'remove');
    });
  });

  return Number(grant > 0) + Number(remove > 0);
};

export const prepareDefaultValues = (
  promisifiedSettingsData: Promise<MainSettingsDataContextValue | null>,
) => {
  return async () => {
    const settingsData = await promisifiedSettingsData;
    invariant(settingsData, '[prepareDefaultValues] settings data is empty.');

    const {
      confirmExpiry,
      defaultAdmins,
      nodeOperatorFeeRate,
      nodeOperatorManagers,
      nodeOperatorFeeRecipient,
    } = settingsData;
    const confirmExpiryCurrent = confirmExpiry.find(
      (item) => item.type === 'current',
    )?.value;
    const nodeOperatorFeeRateCurrent = nodeOperatorFeeRate.find(
      (item) => item.type === 'current',
    )?.value;

    return {
      defaultAdmins,
      nodeOperatorManagers,
      nodeOperatorFeeRecipient,
      confirmExpiry: String(confirmExpiryCurrent),
      confirmExpiryCustom: '',
      nodeOperatorFeeRate: String(nodeOperatorFeeRateCurrent),
      nodeOperatorFeeRateCustom: '',
    };
  };
};

export const formatInputValue = (
  value: string,
  isFocused: boolean,
  hasError: boolean,
  symbol?: string | undefined,
  format?: (arg: string) => string,
) => {
  if (isFocused || hasError) {
    return value;
  }

  return formatValueView(value, symbol, format);
};

export const formatValueView = (
  value: string,
  symbol?: string,
  formatter?: (arg: string) => string,
) => {
  if (!value || value === 'custom') {
    return '';
  }

  if (formatter) {
    return formatter(value);
  }

  if (symbol) {
    return `${value}${symbol}`;
  }

  return value;
};

export const formatSecondsToHours = (
  totalSeconds: number | string,
  isShort?: boolean,
): string => {
  const seconds = Number(totalSeconds);
  if (isNaN(seconds)) return String(totalSeconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0 && minutes === 0) return '~1 minute';
  if (isShort) return `${hours}h`;
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;
  return `${hours}h ${minutes}m`;
};

export const formatSettingsValues = (vaultInfo: VaultMainSettingsData) => {
  const defaultAdmins = vaultInfo.defaultAdmins.map((address) => ({
    value: address,
    state: 'display' as const,
    isGranted: true,
  }));
  const nodeOperatorManagers = vaultInfo.nodeOperatorManagers.map(
    (address) => ({
      value: address,
      state: 'display' as const,
      isGranted: true,
    }),
  );

  return {
    defaultAdmins,
    nodeOperatorManagers,
    confirmExpiryValue: String(vaultInfo.confirmExpiry),
    nodeOperatorFeeRateValue: String(
      (vaultInfo.nodeOperatorFeeRate * 100n) / VAULT_TOTAL_BASIS_POINTS_BN,
    ),
    nodeOperatorFeeRecipient: vaultInfo.nodeOperatorFeeRecipient,
  };
};
