import { type Address, isAddressEqual } from 'viem';

// Shared rules for restoring edits that are not applied on-chain yet (e.g. after partial success
// of a legacy batch), so a retry sends only the remaining txs and applied changes show as current state.

export type RoleEdit = { address: Address; kind: 'grant' | 'revoke' | 'none' };

const hasAddress = (list: Address[], address: Address) =>
  list.some((item) => isAddressEqual(item, address));

// Splits submitted role rows against fresh members:
// - every current member is kept, a revoke stays pending only while the account is still a member
// - a grant stays pending only while the account is not a member yet
export const getPendingRoleEdits = <TField>(
  freshMembers: Address[],
  submitted: TField[],
  toEdit: (field: TField) => RoleEdit,
) => {
  // each field is mapped once, both revokes and grants are derived from it
  const edits = submitted.map((field) => ({ field, edit: toEdit(field) }));

  const revokes = edits
    .filter(({ edit }) => edit.kind === 'revoke')
    .map(({ edit }) => edit.address);

  const members = freshMembers.map((address) => ({
    address,
    isPendingRevoke: hasAddress(revokes, address),
  }));

  const pendingGrants = edits
    .filter(
      ({ edit }) =>
        edit.kind === 'grant' && !hasAddress(freshMembers, edit.address),
    )
    .map(({ field }) => field);

  const hasPending =
    pendingGrants.length > 0 || members.some((m) => m.isPendingRevoke);

  return { members, pendingGrants, hasPending };
};

// A value is pending only if the user edited it (differs from `previous`, the data the txs were built against)
// and it is not on-chain yet, so an unedited value follows fresh data and a change by another admin is not reverted
export const isPendingEdit = <T>(
  submitted: T,
  previous: T,
  fresh: T,
  isEqual: (a: T, b: T) => boolean = Object.is,
) => !isEqual(submitted, previous) && !isEqual(submitted, fresh);

export const isPendingAddressEdit = (
  submitted: Address,
  previous: Address,
  fresh: Address,
) => isPendingEdit(submitted, previous, fresh, isAddressEqual);
