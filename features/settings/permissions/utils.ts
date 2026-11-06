import type { Address } from 'viem';

import {
  getPendingRoleEdits,
  isPendingAddressEdit,
} from 'features/settings/shared/utils';

import type {
  EditPermissionsSchema,
  FieldSchema,
  PermissionsFormData,
} from './types';

export const toPermissionsFormValues = ({
  blockNumber: _,
  ...values
}: PermissionsFormData): EditPermissionsSchema => values;

const getPendingRoleFields = (
  freshFields: FieldSchema[],
  submittedFields: FieldSchema[],
): FieldSchema[] => {
  const { members, pendingGrants } = getPendingRoleEdits(
    freshFields.map(({ account }) => account),
    submittedFields,
    ({ account, action }) => ({
      address: account,
      kind: action === 'grant' || action === 'revoke' ? action : 'none',
    }),
  );

  return [
    ...members.map(
      ({ address, isPendingRevoke }): FieldSchema => ({
        account: address,
        action: isPendingRevoke ? 'revoke' : 'display',
      }),
    ),
    ...pendingGrants,
  ];
};

const getPendingAddress = (
  fresh: Address,
  submitted: Address,
  previous: Address,
) => (isPendingAddressEdit(submitted, previous, fresh) ? submitted : fresh);

// Builds form values on top of fresh on-chain data with only the edits that are not applied yet
// (e.g. after partial success of legacy batch), so applied changes are shown as current state
// and retry sends only the remaining txs
export const getPendingPermissionsValues = (
  fresh: EditPermissionsSchema,
  submitted: EditPermissionsSchema,
  previous: EditPermissionsSchema,
): EditPermissionsSchema => {
  const rolesSchema = Object.fromEntries(
    Object.entries(fresh.rolesSchema).map(([key, freshFields]) => [
      key,
      getPendingRoleFields(
        freshFields ?? [],
        submitted.rolesSchema[key as keyof typeof submitted.rolesSchema] ?? [],
      ),
    ]),
  ) as EditPermissionsSchema['rolesSchema'];

  return {
    ...fresh,
    rolesSchema,
    noGuarantor: getPendingAddress(
      fresh.noGuarantor,
      submitted.noGuarantor,
      previous.noGuarantor,
    ),
    noDepositor: getPendingAddress(
      fresh.noDepositor,
      submitted.noDepositor,
      previous.noDepositor,
    ),
  };
};
