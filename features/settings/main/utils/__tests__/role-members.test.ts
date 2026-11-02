import { describe, expect, it, jest } from '@jest/globals';
import type { Address, Hash } from 'viem';

import { VAULTS_ROOT_ROLES_MAP } from 'modules/vaults/consts/roles';

import {
  findRootRoleLeftEmpty,
  wouldRoleBeEmptyAfterChanges,
} from '../role-members';
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

describe('findRootRoleLeftEmpty', () => {
  const ADMIN_ROLE = VAULTS_ROOT_ROLES_MAP.defaultAdmin;
  const NO_MANAGER_ROLE = VAULTS_ROOT_ROLES_MAP.nodeOperatorManager;

  const reader = (membersByRole: Record<Hash, readonly Address[]>) =>
    jest.fn(async (role: Hash) => membersByRole[role] ?? []);

  it('reads nothing when the form removes no one', async () => {
    const readRoleMembers = reader({});

    await expect(
      findRootRoleLeftEmpty(
        {
          defaultAdmins: [field(A, 'display'), field(B, 'grant')],
          nodeOperatorManagers: [field(C, 'display')],
        },
        readRoleMembers,
      ),
    ).resolves.toBeNull();
    expect(readRoleMembers).not.toHaveBeenCalled();
  });

  it('reads only the role the form removes from', async () => {
    const readRoleMembers = reader({ [NO_MANAGER_ROLE]: [B, C] });

    await expect(
      findRootRoleLeftEmpty(
        {
          defaultAdmins: [field(A, 'display')],
          nodeOperatorManagers: [field(B, 'remove'), field(C, 'display')],
        },
        readRoleMembers,
      ),
    ).resolves.toBeNull();
    expect(readRoleMembers.mock.calls).toEqual([[NO_MANAGER_ROLE]]);
  });

  it('reports the vault manager role when its last member is removed', async () => {
    const readRoleMembers = reader({
      [ADMIN_ROLE]: [A],
      [NO_MANAGER_ROLE]: [B],
    });

    await expect(
      findRootRoleLeftEmpty(
        {
          defaultAdmins: [field(A, 'remove')],
          nodeOperatorManagers: [field(B, 'display')],
        },
        readRoleMembers,
      ),
    ).resolves.toBe('defaultAdmins');
  });

  it('reports the node operator manager role against fresh members', async () => {
    // the form still shows A, but another session already revoked it
    const readRoleMembers = reader({
      [ADMIN_ROLE]: [C],
      [NO_MANAGER_ROLE]: [B],
    });

    await expect(
      findRootRoleLeftEmpty(
        {
          defaultAdmins: [field(C, 'display')],
          nodeOperatorManagers: [field(A, 'display'), field(B, 'remove')],
        },
        readRoleMembers,
      ),
    ).resolves.toBe('nodeOperatorManagers');
  });

  it('propagates a failed members read', async () => {
    const error = new Error('RPC unavailable');
    const readRoleMembers = jest.fn(async (_role: Hash): Promise<Address[]> => {
      throw error;
    });

    await expect(
      findRootRoleLeftEmpty(
        {
          defaultAdmins: [field(A, 'remove'), field(B, 'display')],
          nodeOperatorManagers: [],
        },
        readRoleMembers,
      ),
    ).rejects.toBe(error);
  });
});
