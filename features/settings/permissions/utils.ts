import { type Address, isAddressEqual } from 'viem';

import type {
  EditPermissionsSchema,
  FieldSchema,
  PermissionsFormData,
} from './types';

export const toPermissionsFormValues = ({
  blockNumber: _,
  ...values
}: PermissionsFormData): EditPermissionsSchema => values;

const hasAddress = (list: Address[], address: Address) =>
  list.some((item) => isAddressEqual(item, address));

const getPendingRoleFields = (
  freshFields: FieldSchema[],
  submittedFields: FieldSchema[],
): FieldSchema[] => {
  const freshMembers = freshFields.map(({ account }) => account);
  const toRevoke = submittedFields
    .filter(({ action }) => action === 'revoke')
    .map(({ account }) => account);

  // every current member is shown, a revoke stays pending only while the account is still a member
  const members = freshMembers.map(
    (account): FieldSchema => ({
      account,
      action: hasAddress(toRevoke, account) ? 'revoke' : 'display',
    }),
  );

  // a grant stays pending only while the account is not a member yet
  const pendingGrants = submittedFields.filter(
    ({ action, account }) =>
      action === 'grant' && !hasAddress(freshMembers, account),
  );

  return [...members, ...pendingGrants];
};

const getPendingAddress = (
  fresh: Address,
  submitted: Address,
  previous: Address,
) =>
  // an unedited value follows fresh data, so a change by another admin is not reverted
  !isAddressEqual(submitted, previous) && !isAddressEqual(submitted, fresh)
    ? submitted
    : fresh;

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
