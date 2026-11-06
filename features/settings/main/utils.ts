import { type Address, isAddressEqual } from 'viem';

import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';
import {
  getPendingRoleEdits,
  isPendingAddressEdit,
  isPendingEdit,
} from 'features/settings/shared/utils';
import { formatSecondsToHours, formatExpiry } from 'utils/formats';

import { multipleDataFields } from './consts';
import { feePercentToBasisPoints } from 'modules/vaults/utils/fee';

export { feePercentToBasisPoints };
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
    (fields ?? []).forEach((field: RoleFieldSchema) => {
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
    (vaultInfo.feeRate * 100) / VAULT_TOTAL_BASIS_POINTS,
  );
  const feeRecipient = vaultInfo.feeRecipient;

  const confirmExpiry: VotingOptionType[] = [
    {
      value: confirmExpiryCurrent,
      type: 'current',
      tags: ['Current'],
      format: formatSecondsToHours,
      symbol: ' hours',
    },
  ];
  const feeRate: VotingOptionType[] = [
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

  feeRate.push(
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
  feeRate.push({
    value: '',
    type: 'custom',
    tags: [],
    symbol: '%',
    placeholder: 'Propose new, %',
  });

  // Sorting
  confirmExpiry.sort(myProposalsLast);
  feeRate.sort(myProposalsLast);

  return {
    defaultAdmins: vaultInfo.defaultAdmins,
    nodeOperatorManagers: vaultInfo.nodeOperatorManagers,
    feeRecipient,
    isDepositAllowed: vaultInfo.isDepositAllowed,
    pdgPolicy: vaultInfo.pdgPolicy,
    blockNumber: vaultInfo.blockNumber,
    confirmExpiryCurrent,
    confirmExpiry,
    nodeOperatorFeeRateCurrent,
    feeRate,
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
    isDepositAllowed: data.isDepositAllowed,
    feeRecipient: data.feeRecipient,

    confirmExpiry: data.confirmExpiryCurrent,
    confirmExpiryCustom: '',

    feeRate: data.nodeOperatorFeeRateCurrent,
    feeRateCustom: '',

    pdgPolicy: data.pdgPolicy,
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

const getPendingRoles = (
  freshMembers: Address[],
  submitted: RoleFieldSchema[],
): RoleFieldSchema[] | undefined => {
  const { members, pendingGrants, hasPending } = getPendingRoleEdits(
    freshMembers,
    submitted,
    ({ value, state }) => ({
      address: value,
      kind:
        state === 'grant' ? 'grant' : state === 'remove' ? 'revoke' : 'none',
    }),
  );
  if (!hasPending) return undefined;

  return [
    ...members.map(({ address, isPendingRevoke }) => ({
      value: address,
      state: isPendingRevoke ? ('remove' as const) : ('display' as const),
      isGranted: true,
    })),
    ...pendingGrants,
  ];
};

const isProposalApplied = (
  value: number,
  current: string,
  options: VotingOptionType[],
  normalize: (value: number | string) => number = Number,
) =>
  value === normalize(current) ||
  options.some(
    (option) =>
      option.type === 'My proposal' && normalize(option.value) === value,
  );

// Returns submitted edits that are not applied on-chain yet (e.g. after partial success of legacy batch)
// so the form can be restored on top of fresh data and retry continues from the remaining txs.
// Only fields the user edited (differ from `previous`, the data the txs were built against) can be pending,
// so a change made by another admin meanwhile is not reverted.
export const getPendingFormValues = (
  fresh: MainSettingsFormData,
  submitted: MainSettingsFormValidatedValues,
  previous: MainSettingsFormData,
): Partial<MainSettingFormsValues> => {
  const pending: Partial<MainSettingFormsValues> = {};

  const defaultAdmins = getPendingRoles(
    fresh.defaultAdmins,
    submitted.defaultAdmins,
  );
  if (defaultAdmins) pending.defaultAdmins = defaultAdmins;

  const nodeOperatorManagers = getPendingRoles(
    fresh.nodeOperatorManagers,
    submitted.nodeOperatorManagers,
  );
  if (nodeOperatorManagers) pending.nodeOperatorManagers = nodeOperatorManagers;

  // edit checks below are kept in sync with the tx builder in useEditMainSettings
  if (
    isPendingAddressEdit(
      submitted.feeRecipient,
      previous.feeRecipient,
      fresh.feeRecipient,
    )
  ) {
    pending.feeRecipient = submitted.feeRecipient;
  }
  if (isPendingEdit(submitted.pdgPolicy, previous.pdgPolicy, fresh.pdgPolicy)) {
    pending.pdgPolicy = submitted.pdgPolicy;
  }
  if (
    isPendingEdit(
      submitted.isDepositAllowed,
      previous.isDepositAllowed,
      fresh.isDepositAllowed,
    )
  ) {
    pending.isDepositAllowed = submitted.isDepositAllowed;
  }

  const { feeRate, feeRateCustom } = submitted;
  const feeValue = feePercentToBasisPoints(
    feeRate !== 'custom' ? feeRate : feeRateCustom ?? '',
  );
  const isFeeEdited =
    feeValue !== feePercentToBasisPoints(previous.nodeOperatorFeeRateCurrent);
  if (
    isFeeEdited &&
    !isProposalApplied(
      feeValue,
      fresh.nodeOperatorFeeRateCurrent,
      fresh.feeRate,
      feePercentToBasisPoints,
    )
  ) {
    pending.feeRate = feeRate;
    pending.feeRateCustom = feeRateCustom;
  }

  const { confirmExpiry, confirmExpiryCustom } = submitted;
  const expiryValue =
    confirmExpiry === 'custom' && confirmExpiryCustom
      ? Number(confirmExpiryCustom) * 3600
      : Number(confirmExpiry);
  const isExpiryEdited = expiryValue !== Number(previous.confirmExpiryCurrent);
  if (
    isExpiryEdited &&
    !isProposalApplied(
      expiryValue,
      fresh.confirmExpiryCurrent,
      fresh.confirmExpiry,
    )
  ) {
    pending.confirmExpiry = confirmExpiry;
    pending.confirmExpiryCustom = confirmExpiryCustom;
  }

  return pending;
};
