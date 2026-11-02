import type { Address, Hash } from 'viem';

import { VAULTS_ROOT_ROLES_MAP } from 'modules/vaults/consts/roles';

import type {
  ManagersKeys,
  MainSettingsFormValidatedValues,
  RoleFieldSchema,
} from '../types';

const ROOT_ROLE_FIELDS: readonly { field: ManagersKeys; role: Hash }[] = [
  { field: 'defaultAdmins', role: VAULTS_ROOT_ROLES_MAP.defaultAdmin },
  {
    field: 'nodeOperatorManagers',
    role: VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
  },
];

export const wouldRoleBeEmptyAfterChanges = (
  currentMembers: readonly Address[],
  fields: readonly RoleFieldSchema[],
): boolean => {
  const remainingMembers = new Set(
    currentMembers.map((member) => member.toLowerCase()),
  );

  fields.forEach(({ state, value }) => {
    const address = value.toLowerCase();
    if (state === 'remove') remainingMembers.delete(address);
    if (state === 'grant') remainingMembers.add(address);
  });

  return remainingMembers.size === 0;
};

// Reads fresh members only for roles the form removes from
export const findRootRoleLeftEmpty = async (
  formValues: Pick<MainSettingsFormValidatedValues, ManagersKeys>,
  readRoleMembers: (role: Hash) => Promise<readonly Address[]>,
): Promise<ManagersKeys | null> => {
  const emptiedFields = await Promise.all(
    ROOT_ROLE_FIELDS.filter(({ field }) =>
      formValues[field].some(({ state }) => state === 'remove'),
    ).map(async ({ field, role }) =>
      wouldRoleBeEmptyAfterChanges(
        await readRoleMembers(role),
        formValues[field],
      )
        ? field
        : null,
    ),
  );

  return emptiedFields.find((field) => field !== null) ?? null;
};
