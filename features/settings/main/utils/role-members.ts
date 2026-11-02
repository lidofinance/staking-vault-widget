import type { Address } from 'viem';

import type { RoleFieldSchema } from '../types';

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
