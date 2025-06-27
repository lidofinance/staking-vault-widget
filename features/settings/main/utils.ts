import { type Address, isAddressEqual } from 'viem';

import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

import { multipleDataFields } from './consts';
import type {
  RoleFieldSchema,
  MainSettingsFormValidatedValues,
  VaultMainSettingsData,
  MainSettingsFormData,
  VotingOptionType,
  MainSettingFormsValues,
} from './types';

export const shouldIncrementTxCounterByAddresses = (
  formFields: MainSettingsFormValidatedValues,
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

export const formatSettingsValues = (
  vaultInfo: VaultMainSettingsData,
  account: Address,
): MainSettingsFormData => {
  const confirmExpiryValue = String(vaultInfo.confirmExpiry);
  const nodeOperatorFeeRateValue = String(
    (vaultInfo.nodeOperatorFeeRate * 100n) / VAULT_TOTAL_BASIS_POINTS_BN,
  );
  const nodeOperatorFeeRecipient = vaultInfo.nodeOperatorFeeRecipient;

  const confirmExpiry: VotingOptionType[] = [
    {
      value: confirmExpiryValue,
      type: 'current',
      tags: ['Current'],
      format: formatSecondsToHours,
      symbol: ' hours',
    },
  ];
  const nodeOperatorFeeRate: VotingOptionType[] = [
    {
      value: nodeOperatorFeeRateValue,
      type: 'current',
      tags: ['Current'],
      symbol: '%',
    },
  ];

  const formatExpiry = (expiryTimestamp: bigint) =>
    formatSecondsToHours(
      (Number(expiryTimestamp) * 1000 - new Date().getTime()) / 1000,
      true,
    );

  const formatType = (member: Address) =>
    isAddressEqual(member, account) ? 'My proposal' : 'Proposed to me';

  confirmExpiry.push(
    ...vaultInfo.confirmExpiryConfirmations.map((confirmation) => ({
      value: String(Number(confirmation.decodedData.args[0])),
      tags: [
        formatExpiry(confirmation.expiryTimestamp),
        formatType(confirmation.member),
      ],
      type: formatType(confirmation.member) as VotingOptionType['type'],
      format: formatSecondsToHours,
      symbol: ' hours',
    })),
  );

  nodeOperatorFeeRate.push(
    ...vaultInfo.nodeOperatorFeeConfirmations.map((confirmation) => ({
      value: String(Number(confirmation.decodedData.args[0] * 100n) / 10000),
      tags: [
        formatExpiry(confirmation.expiryTimestamp),
        formatType(confirmation.member),
      ],
      type: formatType(confirmation.member) as VotingOptionType['type'],
      symbol: '%',
    })),
  );

  // Custom values for voting
  confirmExpiry.push({
    value: '',
    type: 'custom',
    tags: [],
    symbol: ' hours',
    placeholder: 'Propose new, hours',
  });
  nodeOperatorFeeRate.push({
    value: '',
    type: 'custom',
    tags: [],
    symbol: '%',
    placeholder: 'Propose new, %',
  });

  return {
    defaultAdmins: vaultInfo.defaultAdmins,
    nodeOperatorManagers: vaultInfo.nodeOperatorManagers,
    nodeOperatorFeeRecipient,

    confirmExpiryCurrent: confirmExpiryValue,
    confirmExpiry: confirmExpiry.sort((a, b) => {
      if (a.type === 'My proposal') return 1;
      if (b.type === 'My proposal') return -1;
      return 0;
    }),

    nodeOperatorFeeRateCurrent: nodeOperatorFeeRateValue,
    nodeOperatorFeeRate: nodeOperatorFeeRate.sort((a, b) => {
      if (a.type === 'My proposal') return 1;
      if (b.type === 'My proposal') return -1;
      return 0;
    }),
  };
};

export const prepareDefaultValues = (
  data: MainSettingsFormData,
): MainSettingFormsValues => {
  const defaultAdmins = data.defaultAdmins.map((address) => ({
    value: address,
    state: 'display' as const,
    isGranted: true,
  }));
  const nodeOperatorManagers = data.nodeOperatorManagers.map((address) => ({
    value: address,
    state: 'display' as const,
    isGranted: true,
  }));

  return {
    defaultAdmins,
    nodeOperatorManagers,
    nodeOperatorFeeRecipient: data.nodeOperatorFeeRecipient,

    confirmExpiry: data.confirmExpiryCurrent,
    confirmExpiryCustom: '',

    nodeOperatorFeeRate: data.nodeOperatorFeeRateCurrent,
    nodeOperatorFeeRateCustom: '',
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
