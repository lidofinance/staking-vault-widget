import { describe, test, expect, jest } from '@jest/globals';
import type { Address } from 'viem';

// keep the test on pure logic, without app config and contracts
jest.unstable_mockModule('modules/vaults', () => ({
  VAULT_TOTAL_BASIS_POINTS: 10_000,
}));
jest.unstable_mockModule('utils/formats', () => ({
  formatSecondsToHours: (value: unknown) => value,
  formatExpiry: (value: unknown) => value,
}));
jest.unstable_mockModule('features/settings/main/consts', () => ({
  multipleDataFields: ['defaultAdmins', 'nodeOperatorManagers'],
}));

const { getPendingFormValues } = await import('../utils');
type Fresh = Parameters<typeof getPendingFormValues>[0];
type Submitted = Parameters<typeof getPendingFormValues>[1];

const A = '0x00000000000000000000000000000000000000aa' as Address;
const B = '0x00000000000000000000000000000000000000bb' as Address;
const X = '0x0000000000000000000000000000000000000001' as Address;
const Y = '0x0000000000000000000000000000000000000002' as Address;

const fresh = (overrides: Partial<Fresh> = {}): Fresh => ({
  defaultAdmins: [B],
  nodeOperatorManagers: [],
  feeRecipient: X,
  feeRate: [],
  nodeOperatorFeeRateCurrent: '1',
  confirmExpiry: [],
  confirmExpiryCurrent: '86400',
  isDepositAllowed: true,
  pdgPolicy: '0',
  blockNumber: 10n,
  ...overrides,
});

// user grants A, revokes B, sets fee recipient Y and PDG policy 1
const submitted: Submitted = {
  defaultAdmins: [
    { value: B, state: 'remove', isGranted: true },
    { value: A, state: 'grant' },
  ],
  nodeOperatorManagers: [],
  feeRecipient: Y,
  feeRate: '1',
  confirmExpiry: '86400',
  isDepositAllowed: true,
  pdgPolicy: '1',
};

describe('getPendingFormValues', () => {
  test('nothing applied: every edit stays pending', () => {
    const pending = getPendingFormValues(fresh(), submitted);

    expect(pending.feeRecipient).toBe(Y);
    expect(pending.pdgPolicy).toBe('1');
    expect(pending.defaultAdmins).toEqual([
      { value: B, state: 'remove', isGranted: true },
      { value: A, state: 'grant' },
    ]);
  });

  test('partial success: applied changes are not resent', () => {
    // grant A and fee recipient confirmed, revoke B and PDG policy are not
    const pending = getPendingFormValues(
      fresh({ defaultAdmins: [B, A], feeRecipient: Y }),
      submitted,
    );

    expect(pending).not.toHaveProperty('feeRecipient');
    expect(pending.pdgPolicy).toBe('1');
    expect(pending.defaultAdmins).toEqual([
      { value: B, state: 'remove', isGranted: true },
      { value: A, state: 'display', isGranted: true },
    ]);
  });

  test('full success: nothing is pending', () => {
    const pending = getPendingFormValues(
      fresh({ defaultAdmins: [A], feeRecipient: Y, pdgPolicy: '1' }),
      submitted,
    );

    expect(pending).toEqual({});
  });

  test('fee proposal already made by the user is not resent', () => {
    const pending = getPendingFormValues(
      fresh({ feeRate: [{ value: '2', type: 'My proposal', tags: [] }] }),
      { ...submitted, feeRate: '2' },
    );

    expect(pending).not.toHaveProperty('feeRate');
  });

  test('fee comparison ignores float noise', () => {
    const pending = getPendingFormValues(
      fresh({ nodeOperatorFeeRateCurrent: '0.57' }),
      { ...submitted, feeRate: 'custom', feeRateCustom: '0.57' },
    );

    expect(pending).not.toHaveProperty('feeRate');
  });
});
