import { type Address, isAddressEqual } from 'viem';

import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';
import { formatSecondsToHours, formatExpiry } from 'utils/formats';

import { multipleDataFields } from './consts';
import type {
  RoleFieldSchema,
  MainSettingsFormValidatedValues,
  VaultMainSettingsData,
  MainSettingsFormData,
  VotingOptionType,
  MainSettingFormsValues,
} from './types';

const formatType = (
  member: Address,
  account: Address,
): VotingOptionType['type'] =>
  isAddressEqual(member, account) ? 'My proposal' : 'Proposed to me';

const myProposalsLast = (a: VotingOptionType, b: VotingOptionType): number => {
  if (a.type === 'My proposal') return 1;
  if (b.type === 'My proposal') return -1;
  return 0;
};

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
  const confirmExpiryCurrent = String(vaultInfo.confirmExpiry);
  const nodeOperatorFeeRateCurrent = String(
    (vaultInfo.nodeOperatorFeeRate * 100n) / VAULT_TOTAL_BASIS_POINTS_BN,
  );
  const nodeOperatorFeeRecipient = vaultInfo.nodeOperatorFeeRecipient;

  const confirmExpiry: VotingOptionType[] = [
    {
      value: confirmExpiryCurrent,
      type: 'current',
      tags: ['Current'],
      format: formatSecondsToHours,
      symbol: ' hours',
    },
  ];
  const nodeOperatorFeeRate: VotingOptionType[] = [
    {
      value: nodeOperatorFeeRateCurrent,
      type: 'current',
      tags: ['Current'],
      symbol: '%',
    },
  ];

  confirmExpiry.push(
    ...vaultInfo.confirmExpiryConfirmations.map((confirmation) => ({
      value: String(Number(confirmation.decodedData.args[0])),
      tags: [
        formatExpiry(confirmation.expiryTimestamp),
        formatType(confirmation.member, account),
      ],
      type: formatType(confirmation.member, account),
      format: formatSecondsToHours,
      symbol: ' hours',
    })),
  );

  nodeOperatorFeeRate.push(
    ...vaultInfo.nodeOperatorFeeConfirmations.map((confirmation) => ({
      value: String(
        Number(BigInt(confirmation.decodedData.args[0]) * 100n) / 10000,
      ),
      tags: [
        formatExpiry(confirmation.expiryTimestamp),
        formatType(confirmation.member, account),
      ],
      type: formatType(confirmation.member, account),
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

  // Sorting
  confirmExpiry.sort(myProposalsLast);
  nodeOperatorFeeRate.sort(myProposalsLast);

  return {
    defaultAdmins: vaultInfo.defaultAdmins,
    nodeOperatorManagers: vaultInfo.nodeOperatorManagers,
    nodeOperatorFeeRecipient,
    confirmExpiryCurrent,
    confirmExpiry,
    nodeOperatorFeeRateCurrent,
    nodeOperatorFeeRate,
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
