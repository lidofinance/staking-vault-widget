import { describe, expect, it } from '@jest/globals';
import type { Address } from 'viem';

import { wouldRoleBeEmptyAfterChanges } from '../role-members';
import type { RoleFieldSchema } from '../../types';

const A = '0x0000000000000000000000000000000000000001' as const;
const B = '0x0000000000000000000000000000000000000002' as const;
const C = '0x0000000000000000000000000000000000000003' as const;
const CHECKSUMMED = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84' as const;

const field = (
  value: Address,
  state: RoleFieldSchema['state'],
): RoleFieldSchema => ({ value, state });

describe('wouldRoleBeEmptyAfterChanges', () => {
  it('allows a removal that leaves the last member', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [A, B],
        [field(A, 'remove'), field(B, 'display')],
      ),
    ).toBe(false);
  });

  it('allows replacing the last member', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [A],
        [field(A, 'remove'), field(C, 'grant')],
      ),
    ).toBe(false);
  });

  it('blocks removing the last member after another session changed the role', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [B],
        [field(A, 'display'), field(B, 'remove')],
      ),
    ).toBe(true);
  });

  it('blocks removing every member in one form', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [A, B],
        [field(A, 'remove'), field(B, 'remove')],
      ),
    ).toBe(true);
  });

  it('matches addresses case-insensitively', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [CHECKSUMMED],
        [field(CHECKSUMMED.toLowerCase() as Address, 'remove')],
      ),
    ).toBe(true);
  });

  it('allows the removal when another session added a member', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [A, B, C],
        [field(A, 'remove'), field(B, 'remove')],
      ),
    ).toBe(false);
  });

  it('allows removing several members when one remains', () => {
    expect(
      wouldRoleBeEmptyAfterChanges(
        [A, B, C],
        [field(A, 'remove'), field(B, 'remove'), field(C, 'display')],
      ),
    ).toBe(false);
  });
});
