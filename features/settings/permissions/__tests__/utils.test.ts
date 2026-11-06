import { describe, test, expect } from '@jest/globals';
import type { Address } from 'viem';

import { getPendingPermissionsValues, toPermissionsFormValues } from '../utils';
import type { EditPermissionsSchema, FieldSchema } from '../types';

const A = '0x00000000000000000000000000000000000000aa' as Address;
const B = '0x00000000000000000000000000000000000000bb' as Address;
const C = '0x00000000000000000000000000000000000000cc' as Address;
const G1 = '0x0000000000000000000000000000000000000001' as Address;
const G2 = '0x0000000000000000000000000000000000000002' as Address;
const G3 = '0x0000000000000000000000000000000000000003' as Address;

const display = (account: Address): FieldSchema => ({
  account,
  action: 'display',
});

const values = (
  withdraw: FieldSchema[],
  overrides: Partial<EditPermissionsSchema> = {},
) =>
  ({
    rolesSchema: { withdrawer: withdraw },
    noGuarantor: G1,
    noDepositor: G1,
    ...overrides,
  }) as unknown as EditPermissionsSchema;

describe('getPendingPermissionsValues', () => {
  // before submit: B is a member; user grants A and revokes B
  const previous = values([display(B)]);
  const submitted = values([
    { account: B, action: 'revoke' },
    { account: A, action: 'grant' },
  ]);

  test('confirmed grant is shown as a current member, not as a removable grant', () => {
    // grantRoles confirmed, revokeRoles rejected
    const fresh = values([display(B), display(A)]);

    const pending = getPendingPermissionsValues(fresh, submitted, previous);

    expect(pending.rolesSchema['withdrawer' as never]).toEqual([
      { account: B, action: 'revoke' },
      { account: A, action: 'display' },
    ]);
  });

  test('nothing applied: all edits stay pending', () => {
    const pending = getPendingPermissionsValues(previous, submitted, previous);

    expect(pending.rolesSchema['withdrawer' as never]).toEqual([
      { account: B, action: 'revoke' },
      { account: A, action: 'grant' },
    ]);
  });

  test('changes made by another admin are kept', () => {
    // another admin granted C and revoked B, our grant of A is not applied yet
    const fresh = values([display(C)]);

    const pending = getPendingPermissionsValues(fresh, submitted, previous);

    expect(pending.rolesSchema['withdrawer' as never]).toEqual([
      display(C),
      { account: A, action: 'grant' },
    ]);
  });

  test('unedited guarantor follows fresh data, edited one stays pending until applied', () => {
    const submittedDelegates = values([], { noGuarantor: G2, noDepositor: G1 });
    const previousDelegates = values([], { noGuarantor: G1, noDepositor: G1 });

    // depositor was changed by another admin, guarantor edit is not applied yet
    const notApplied = getPendingPermissionsValues(
      values([], { noGuarantor: G1, noDepositor: G3 }),
      submittedDelegates,
      previousDelegates,
    );
    expect(notApplied.noGuarantor).toBe(G2);
    expect(notApplied.noDepositor).toBe(G3);

    const applied = getPendingPermissionsValues(
      values([], { noGuarantor: G2, noDepositor: G1 }),
      submittedDelegates,
      previousDelegates,
    );
    expect(applied.noGuarantor).toBe(G2);
  });
});

describe('toPermissionsFormValues', () => {
  test('drops the block number from form values', () => {
    const formValues = toPermissionsFormValues({
      ...values([]),
      blockNumber: 1n,
    });
    expect(formValues).not.toHaveProperty('blockNumber');
  });
});
